package com.store.BE.service;

import com.store.BE.domain.product.Category;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.CategorySearchRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    public ApiResponse<Category> createCategory(Category category);
    public PaginationResponse<Category> getAllCategories(CategorySearchRequest request, Pageable pageable);
    public ApiResponse<List<Category>> getAllCategories();
    public ApiResponse<Category> getCategoryById(Long id);
    public ApiResponse<Category> updateCategory(Long id, Category categoryUpdate);
    public ApiResponse<Category> deleteCategory(Long id);
}
