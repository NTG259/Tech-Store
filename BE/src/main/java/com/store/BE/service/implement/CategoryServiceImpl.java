package com.store.BE.service.implement;

import com.store.BE.domain.product.Category;
import com.store.BE.domain.product.CategoryResponse;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.CategorySearchRequest;
import com.store.BE.repository.CategoryRepository;
import com.store.BE.repository.ProductRepository;
import com.store.BE.service.CategoryService;
import com.store.BE.utils.convert.PaginationUtil;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import com.store.BE.utils.specification.CategorySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public ApiResponse<Category> createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName()) && categoryRepository.existsBySlug(category.getSlug())) {
            throw new BusinessException(ErrorCode.CATEGORIES_ALREADY_EXIST);
        }

        return new ApiResponse<>(
                this.categoryRepository.save(category),
                "Tạo mới danh mục thành công",
                null,
                HttpStatus.CREATED.value()
        );
    }

    @Override
    public PaginationResponse<Category> getAllCategories(
            CategorySearchRequest request,
            Pageable pageable
    ) {
        Specification<Category> specification = CategorySpecification.filter(request);
        Page<Category> page = this.categoryRepository.findAll(specification, pageable);
        return PaginationUtil.convertResponse(page);
    }

    @Override
    public ApiResponse<List<Category>> getAllCategories() {
        return new ApiResponse<>(
                this.categoryRepository.findAll(),
                "Lấy tất cả danh mục thành công",
                null,
                HttpStatus.OK.value()
        );
    }

    @Override
    public ApiResponse<Category> getCategoryById(Long id) {
        Optional<Category> categoryOptional = this.categoryRepository.findById(id);
        Category category = categoryOptional.orElseThrow(
                () -> new BusinessException(ErrorCode.DATA_NOT_FOUND)
        );

        return new ApiResponse<>(
                category,
                "Lấy danh mục thành công",
                null,
                HttpStatus.OK.value()
        );
    }

    @Override
    public ApiResponse<Category> updateCategory(Long id, Category categoryUpdate) {
        if (!categoryRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }

        return new ApiResponse<>(
                this.categoryRepository.save(categoryUpdate),
                "Cập nhật danh mục thành công",
                null,
                HttpStatus.OK.value()
        );
    }

    @Override
    @Transactional
    public ApiResponse<Category> deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Category uncategorized =
                categoryRepository.findBySlug("chua-xac-dinh")
                        .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND));

        productRepository.updateCategory(id, uncategorized.getId());

        this.categoryRepository.deleteById(id);
        return new ApiResponse<>(
                null,
                "Xóa danh mục thành công",
                null,
                HttpStatus.OK.value()
        );
    }

    @Override
    public ApiResponse<List<CategoryResponse>> getAllCategoriesByAdmin(
            String name,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<CategoryResponse> result = categoryRepository
                .getCategories(name, sortBy, direction, pageable);

        return new ApiResponse<>(
                result.getContent(),
                "Lấy danh mục thành công",
                null,
                HttpStatus.OK.value()
        );
    }

    @Override
    public ApiResponse<List<CategoryResponse>> getAllCategoriesByAdminStat() {
        return new ApiResponse<>(
                this.categoryRepository.getCategoryStatistics(),
                "Lấy danh mục (kèm thống kê) thành công",
                null,
                HttpStatus.OK.value()
        );
    }
}
