package com.store.BE.controller.admin;


import com.store.BE.domain.product.Category;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.CategorySearchRequest;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.service.CategoryService;
import com.store.BE.utils.convert.SlugUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping(params = {
            "page",
            "size",
            "name"
    })
    public ResponseEntity<PaginationResponse<Category>> getAllCategories(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam("name") String name
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        CategorySearchRequest request = new CategorySearchRequest();
        request.setName(name);

        return ResponseEntity.ok().body(
                this.categoryService.getAllCategories(request, pageable));
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
