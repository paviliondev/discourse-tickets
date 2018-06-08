Tickets! In Discourse!

# Development

The development instance of Discourse will need the tags and tag groups this plugin expects. Drop the content below in your development Discourse Rails root at `db/seeds.rb`, then run `rake db:seed` to ensure tagging in enabled and that the expected tags exist with the correct permissions.

```ruby
SiteSetting.set(:tagging_enabled, true)
SiteSetting.set(:tag_style, "box")
SiteSetting.set(:tags_listed_by_group, true)

def tag_factory(tags=[])
  tags.map do |tag_name|
    Tag.find_or_create_by(name: tag_name)
  end
end

staff_tags = tag_factory %w(kb ticket)

priority_tags = tag_factory %w(priority-high
                   priority-immediate
                   priority-low
                   priority-normal
                   priority-urgent
                  )

reason_tags = tag_factory %w(reason-appealforhelp
                 reason-bademail
                 reason-cancelaccount
                 reason-confirmemail
                 reason-coreapp
                 reason-exchange
                 reason-forumpost
                 reason-forumtopic
                 reason-memberprofile
                 reason-networkinvite
                 reason-nps
                 reason-onboarding
                 reason-orgprofile
                 reason-partnership
                 reason-resource
                 reason-skypecall
                 reason-topicmerge
                 reason-username
                 reason-webinar
                )

status_tags = tag_factory %w(status-backburner
                             status-new
                             status-resolved
                             status-triaging
                             status-underway
                             status-waiting
                            )

ticket_tag = Tag.find_by(name: "ticket")
staff = Group::AUTO_GROUPS[:staff]
full_permission = TagGroupPermission.permission_types[:full]

staff_tag_group = TagGroup.find_or_create_by(name: "Staff")
staff_tag_group.tags = staff_tags
staff_tag_group.permissions = [[staff, full_permission]]
staff_tag_group.save!

priority_tag_group = TagGroup.find_or_create_by(name: "Ticket Priority")
priority_tag_group.parent_tag = ticket_tag
priority_tag_group.tags = priority_tags
priority_tag_group.permissions = [[staff, full_permission]]
priority_tag_group.one_per_topic = true
priority_tag_group.save!

reason_tag_group = TagGroup.find_or_create_by(name: "Ticket Reason")
reason_tag_group.parent_tag = ticket_tag
reason_tag_group.tags = reason_tags
reason_tag_group.permissions = [[staff, full_permission]]
reason_tag_group.save!

status_tag_group = TagGroup.find_or_create_by(name: "Ticket Status")
status_tag_group.parent_tag = ticket_tag
status_tag_group.tags = status_tags
status_tag_group.permissions = [[staff, full_permission]]
status_tag_group.one_per_topic = true
status_tag_group.save!
```
