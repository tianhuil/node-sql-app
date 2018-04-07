npx postgraphile \
  -n 0.0.0.0 \
  -p $API_PORT \
  --cors \
  -c postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB \
  --schema forum_example \
  --watch
