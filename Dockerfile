# Stage 1: Build the JAR file safely without requiring the database
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app
COPY . .
WORKDIR /app/backend-java
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/backend-java/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]