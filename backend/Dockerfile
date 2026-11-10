FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/coco-backend-0.1.0-SNAPSHOT.jar app.jar
ENV SERVER_PORT=10000
EXPOSE 10000
ENTRYPOINT ["java","-jar","app.jar"]
