package com.store.BE.utils.convert;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.Meta;
import com.store.BE.domain.response.PaginationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class PaginationUtil {
    public static <T> PaginationResponse<T> convertResponse(Page<T> page) {

        Meta meta = new Meta();
        meta.setPage(page.getNumber() + 1);
        meta.setSize(page.getSize());
        meta.setTotalPages(page.getTotalPages());
        meta.setTotalItems(page.getTotalElements());

        PaginationResponse<T> paginationResponse = new PaginationResponse<>();
        paginationResponse.setMeta(meta);
        paginationResponse.setData(page.getContent());

        return paginationResponse;
    }
}
