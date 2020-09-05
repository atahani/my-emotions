CREATE OR REPLACE FUNCTION notify_new_emotion ()
  RETURNS TRIGGER
  AS $BODY$
BEGIN
  PERFORM
    pg_notify('new_emotion', row_to_json((
        SELECT
          t FROM (
            SELECT
              * FROM get_emotion_view_by_id (NEW.id)) AS t))::text);
  RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql;

