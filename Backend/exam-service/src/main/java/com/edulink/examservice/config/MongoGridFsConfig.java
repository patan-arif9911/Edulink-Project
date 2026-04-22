package com.edulink.examservice.config;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

@Configuration
public class MongoGridFsConfig {

    @Bean
    public GridFsTemplate gridFsTemplate(MongoDatabaseFactory mongoDbFactory, MongoConverter mongoConverter) {
        return new GridFsTemplate(mongoDbFactory, mongoConverter);
    }

    @Bean
    public GridFSBucket gridFSBucket(MongoDatabaseFactory mongoDbFactory) {
        MongoDatabase db = mongoDbFactory.getMongoDatabase();
        return GridFSBuckets.create(db);
    }
}