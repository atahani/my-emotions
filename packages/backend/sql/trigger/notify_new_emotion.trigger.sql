DO $$
BEGIN
  IF NOT EXISTS (
    SELECT
      *
    FROM
      information_schema.triggers
    WHERE
      event_object_table = 'emotion'
      AND trigger_name = 'notify_new_emotion_trigger') THEN
  CREATE TRIGGER notify_new_emotion_trigger
    AFTER INSERT ON "emotion"
    FOR EACH ROW
    EXECUTE PROCEDURE notify_new_emotion ( );
END IF;
END;
$$;

