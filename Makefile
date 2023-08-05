package-client:
	@echo "Building client..."
	@cd client && yarn build
	@echo "Done building client"

package-server:
	@echo "Building server..."
	@cd server && yarn build && zip -r build.zip build
	@echo "Done building server"

package: package-client package-server

deploy: package
	@echo "Deploying..."
	@cd infra && terraform apply
	@aws s3 sync client/build s3://landing-gpt-releases/
	@echo "Done deploying"