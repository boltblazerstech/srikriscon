package com.ecommerce.backend.upload.config;

import com.ecommerce.backend.common.config.R2Properties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;

import java.net.URI;

@Configuration
@RequiredArgsConstructor
@ConditionalOnExpression("!'${cloudflare.r2.endpoint:}'.isEmpty()")
public class S3Config {

    private final R2Properties r2Properties;

    @Bean
    public S3Client s3Client() {
        S3Configuration s3Config = S3Configuration.builder()
                .chunkedEncodingEnabled(false)
                .build();

        return S3Client.builder()
                .httpClient(UrlConnectionHttpClient.builder().build())
                .endpointOverride(URI.create(r2Properties.getEndpoint()))
                .region(Region.of(r2Properties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(
                                r2Properties.getAccessKey(),
                                r2Properties.getSecretKey())))
                .serviceConfiguration(s3Config)
                .forcePathStyle(true) // required for R2
                .build();
    }
}
