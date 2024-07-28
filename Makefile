make flask_devserver:
	docker compose --env-file .env -f devserver-compose.yml up --build

make flask_devserver_test:
	docker compose --env-file .env -f devserver-compose.yml up flask db --build

make del_vols:
	docker-compose -f devserver-compose.yml down --volumes

make influx:
	docker compose --env-file .env -f devserver-compose.yml up influxdb --build