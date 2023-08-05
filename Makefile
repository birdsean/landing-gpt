package-client:
	@echo "Building client..."
	@cd client && yarn build
	@echo "Done building client"

package-server:
	@echo "Building server..."
	@cd server && yarn build && zip -r build.zip build
	@echo "Done building server"

deploy-server: package-server
	@echo "Deploying server..."
	@cd infra && terraform apply -auto-approve
	@echo "Done deploying server"

deploy-client: package-client
	@echo "Deploying client..."
	@aws s3 sync client/build s3://landing-gpt-releases/
	@echo "Done deploying client"

deploy: deploy-server deploy-client

dev-client:
	@echo "Starting client..."
	@cd client && yarn start

dev-server:
	@echo "Starting server..."
	@cd server && yarn start
