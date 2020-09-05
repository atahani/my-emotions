CREATE OR REPLACE FUNCTION get_emotion_view_by_id (_emotion_id uuid)
  RETURNS TABLE (
    id uuid,
    "text" text,
    "userBriefProfileView" json,
    emoji text,
    "createdAt" timestamp WITH time zone
  )
  AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.text,
    json_build_object('id', u.id, 'displayName', u.display_name, 'imageURL', u.image_url) AS "userBriefProfileView",
    e.emoji,
    e.created_at AS "createdAt"
  FROM
    emotion AS e
    JOIN m_user AS u ON e.user_id = u.id
  WHERE
    e.id = _emotion_id;
END;
$$
LANGUAGE plpgsql;

