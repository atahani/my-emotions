CREATE OR REPLACE FUNCTION notify_new_emotion ()
  RETURNS TRIGGER
  AS $BODY$
BEGIN
  PERFORM
    pg_notify('new_emotion', row_to_json((
        SELECT
          t FROM (
            SELECT
              * FROM emotion_view
            WHERE
              id = NEW.id) AS t))::text);
  RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql;

