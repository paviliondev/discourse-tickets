Tickets::Tag::GROUPS.each do |tag_group_name|
  unless TagGroup.exists?(name: tag_group_name)
    tag_group = TagGroup.new(
      name: tag_group_name,
      one_per_topic: true,
      permissions: {
        staff: 1
      }
    )

    tag_group.save
  end
end
