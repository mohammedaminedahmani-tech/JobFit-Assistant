# ===== Étape 1 : compilation =====
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# D'abord le pom.xml seul : les dépendances sont mises en cache
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Puis le code source, et on construit le .jar
COPY src ./src
RUN mvn -B package -DskipTests

# ===== Étape 2 : exécution =====
FROM eclipse-temurin:21-jre
WORKDIR /app

# Sécurité : on ne tourne pas en root
RUN useradd --create-home appuser
USER appuser

# On récupère uniquement le .jar de l'étape 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]