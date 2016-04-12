call mvn clean package
call move /y "target\fakestagram-backend*" "..\..\wildfly-10.0.0.Final\standalone\deployments\sec.war" 