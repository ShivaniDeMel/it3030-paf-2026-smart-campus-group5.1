package com.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {"com.smartcampus.repository", "com.smartcampus.backend.repository"})
public class MongoConfig {
}
