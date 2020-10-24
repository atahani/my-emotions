CREATE OR REPLACE VIEW emotion_view AS
SELECT
  e.id,
  u.id AS "userId",
  e.text,
  json_build_object('id', u.id, 'displayName', u.display_name, 'imageURL', u.image_url) AS "userBriefProfileView",
  e.emoji,
  e.created_at AS "createdAt"
FROM
  emotion AS e
  JOIN m_user AS u ON e.user_id = u.id;

