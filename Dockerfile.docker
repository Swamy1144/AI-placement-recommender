FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY . .
WORKDIR /app/backend-java
RUN chmod +x mvnw
CMD ["./mvnw", "spring-boot:run"]