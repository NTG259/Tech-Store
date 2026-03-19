package com.store.BE.utils.convert;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtils {

    public static String createSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        String temp = input.trim().toLowerCase()
                .replace("đ", "d");

        // Loại bỏ dấu Tiếng Việt
        String normalized = Normalizer.normalize(temp, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String noAccents = pattern.matcher(normalized).replaceAll("");

        // Thay thế các ký tự không phải chữ cái/số bằng dấu gạch ngang '-'
        String slug = noAccents.replaceAll("[^a-z0-9]+", "-");

        // Xóa dấu gạch ngang thừa ở đầu và cuối (nếu có)
        return slug.replaceAll("^-|-$", "");
    }
}
