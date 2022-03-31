buildDocker:
	docker build -t ronin_middleware .

runDocker:
	docker run -d -p 5000:5000 --name=Ronin_Middleware --restart=always ronin_middleware