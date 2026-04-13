package com.store.BE.controller.admin;


import com.store.BE.domain.product.Category;
import com.store.BE.domain.product.CategoryResponse;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.CategorySearchRequest;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.service.CategoryService;
import com.store.BE.utils.convert.SlugUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        category.setSlug(SlugUtils.createSlug(category.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(
                this.categoryService.createCategory(category)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(
            @RequestParam(required = false) String name,
            @RequestParam() int page,
            @RequestParam() int size,
            @RequestParam() String sortBy,
            @RequestParam() String direction
    ) {
        return ResponseEntity.ok().body(
                this.categoryService.getAllCategoriesByAdmin(name, page - 1, size, sortBy, direction)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok().body(
                this.categoryService.getCategoryById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody Category category) {
        category.setSlug(SlugUtils.createSlug(category.getName()));

        return ResponseEntity.ok().body(this.categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> deleteCategory(
            @PathVariable Long id
            ) {
        return ResponseEntity.ok().body(this.categoryService.deleteCategory(id));
    }
}
