package com.ecommerce.backend.cms.service;

import com.ecommerce.backend.cms.dto.BlogPostRequest;
import com.ecommerce.backend.cms.dto.BlogPostResponse;
import com.ecommerce.backend.cms.entity.BlogPost;
import com.ecommerce.backend.cms.repository.BlogPostRepository;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    @Transactional(readOnly = true)
    public List<BlogPostResponse> findAll() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(BlogPostResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BlogPostResponse findBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
        return BlogPostResponse.from(post);
    }

    @Transactional(readOnly = true)
    public BlogPostResponse findById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost", id));
        return BlogPostResponse.from(post);
    }

    @Transactional
    public BlogPostResponse create(BlogPostRequest req) {
        if (blogPostRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new BadRequestException("Blog post with slug already exists: " + req.getSlug());
        }
        BlogPost post = BlogPost.builder()
                .title(req.getTitle())
                .slug(req.getSlug())
                .excerpt(req.getExcerpt())
                .content(req.getContent())
                .category(req.getCategory())
                .author(req.getAuthor())
                .imageUrl(req.getImageUrl())
                .readTime(req.getReadTime())
                .build();
        return BlogPostResponse.from(blogPostRepository.save(post));
    }

    @Transactional
    public BlogPostResponse update(Long id, BlogPostRequest req) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost", id));
        
        blogPostRepository.findBySlug(req.getSlug()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Blog post with slug already exists: " + req.getSlug());
            }
        });

        post.setTitle(req.getTitle());
        post.setSlug(req.getSlug());
        post.setExcerpt(req.getExcerpt());
        post.setContent(req.getContent());
        post.setCategory(req.getCategory());
        post.setAuthor(req.getAuthor());
        post.setImageUrl(req.getImageUrl());
        post.setReadTime(req.getReadTime());

        return BlogPostResponse.from(blogPostRepository.save(post));
    }

    @Transactional
    public void delete(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost", id));
        blogPostRepository.delete(post);
    }
}
