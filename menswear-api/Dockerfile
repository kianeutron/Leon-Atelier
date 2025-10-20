# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY MensWear.Api.csproj ./
RUN dotnet restore "MensWear.Api.csproj"

# Copy the rest of the source
COPY . .

# Publish (Release)
RUN dotnet publish "MensWear.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Set binding for Render / container platforms
ENV ASPNETCORE_URLS=http://+:8080

# Copy published output
COPY --from=build /app/publish .

# Expose container port
EXPOSE 8080

# Run
ENTRYPOINT ["dotnet", "MensWear.Api.dll"]
