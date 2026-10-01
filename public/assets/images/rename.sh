#!/bin/bash
# ============================================================
# rename.sh - Tổ chức ảnh từ "NỘI DUNG CHO WEB" → "locations"
# Chạy từ thư mục: public/assets/images/
# Cách dùng: bash rename.sh
# ============================================================

set -e  # Dừng nếu có lỗi

# ----- CẤU HÌNH ĐƯỜNG DẪN -----
SOURCE_DIR="NỘI DUNG CHO WEB"
DEST_DIR="locations"

# ----- TẠO THƯ MỤC ĐÍCH -----
mkdir -p "$DEST_DIR"

# ----- HÀM TẠO THƯ MỤC ĐÍCH -----
create_dest() {
    local slug="$1"
    mkdir -p "$DEST_DIR/$slug"
    echo "📁 Đã tạo: $DEST_DIR/$slug"
}

# ----- HÀM COPY + RENAME -----
# $1: file nguồn (đường dẫn đầy đủ)
# $2: slug địa điểm
# $3: số thứ tự ảnh (1, 2, 3, 4...)
# $4: extension đích (jpg, png, webp) - mặc định giữ nguyên
copy_img() {
    local src="$1"
    local slug="$2"
    local num="$3"
    local ext="${4:-${src##*.}}"

    if [ ! -f "$src" ]; then
        echo "⚠️  Không tìm thấy: $src"
        return 1
    fi

    local dest="$DEST_DIR/$slug/image-$num.$ext"
    cp "$src" "$dest"
    echo "   ✅ image-$num.$ext  ←  $(basename "$src")"
}

echo ""
echo "=========================================="
echo "🚀 BẮT ĐẦU TỔ CHỨC ẢNH"
echo "=========================================="
echo ""

# ============================================================
# 1. THÁP EIFFEL (eiffel-tower)
# Nguồn: CHƯƠNG 13,14,15,16 / Tháp Eiffel (1-4).jpg
# ============================================================
create_dest "eiffel-tower"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Tháp Eiffel (1).jpg" "eiffel-tower" 1 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Tháp Eiffel (2).jpg" "eiffel-tower" 2 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Tháp Eiffel (3).jpg" "eiffel-tower" 3 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Tháp Eiffel (4).jpg" "eiffel-tower" 4 "jpg"

# ============================================================
# 2. CẦU ALEXANDRE III (alexandre-iii-bridge)
# Nguồn: CHƯƠNG 17,18,19 / Cầu Alexandre III*.jpg
# ============================================================
create_dest "alexandre-iii-bridge"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/Cầu Alexandre III.jpg" "alexandre-iii-bridge" 1 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/Cầu Alexandre III 2.jpg" "alexandre-iii-bridge" 2 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/Cầu Alexandre III 3.jpg" "alexandre-iii-bridge" 3 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/Cầu Alexandre III 4.jpg" "alexandre-iii-bridge" 4 "jpg"

# ============================================================
# 3. CÔNG VIÊN BERCY (bercy-park)
# Nguồn: CHƯƠNG 20,21,22 / Công viên Bercy 1-4.png/jpg
# ============================================================
create_dest "bercy-park"
copy_img "$SOURCE_DIR/CHƯƠNG 20, 21, 22 (NHƯ THUẦN)/Công viên Bercy 1(Chương 21).png" "bercy-park" 1 "png"
copy_img "$SOURCE_DIR/CHƯƠNG 20, 21, 22 (NHƯ THUẦN)/Công viên Bercy 2(Chương 21).jpg" "bercy-park" 2 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 20, 21, 22 (NHƯ THUẦN)/Công viên Bercy 3(Chương 21).jpg" "bercy-park" 3 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 20, 21, 22 (NHƯ THUẦN)/Công viên Bercy 4(Chương 21).jpg" "bercy-park" 4 "jpg"

# ============================================================
# 4. ĐẠI LỘ CHAMPS-ÉLYSÉES (champs-elysees)
# Nguồn: CHƯƠNG 13,14,15,16 / Đại lộ Champs-Elyseees (1-3)*.png
# ============================================================
create_dest "champs-elysees"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Đại lộ Champs-Elyseees (1).png" "champs-elysees" 1 "png"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Đại lộ Champs-Elyseees (2).png" "champs-elysees" 2 "png"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Đại lộ Champs-Elyseees (3).png" "champs-elysees" 3 "png"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Đại lộ Champs-Elyseees (1)(1).png" "champs-elysees" 4 "png"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Đại lộ Champs-Elyseees (2)(1).png" "champs-elysees" 5 "png"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Đại lộ Champs-Elyseees (3)(1).png" "champs-elysees" 6 "png"

# ============================================================
# 5. PHỐ FAUBOURG SAINT-HONORÉ (faubourg-saint-honore)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "faubourg-saint-honore"
# TODO: Thêm ảnh cho faubourg-saint-honore
echo "   ⚠️  faubourg-saint-honore: chưa có ảnh nguồn"

# ============================================================
# 6. GA GARE DE LYON (gare-de-lyon)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "gare-de-lyon"
# TODO: Thêm ảnh cho gare-de-lyon
echo "   ⚠️  gare-de-lyon: chưa có ảnh nguồn"

# ============================================================
# 7. CAFÉ LES DEUX MAGOTS (les-deux-magots)
# Nguồn: CHƯƠNG 17,18,19 / les deux magots*
# ============================================================
create_dest "les-deux-magots"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/quán cf les deux magots.jpg" "les-deux-magots" 1 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/les deux magots 2.jpg" "les-deux-magots" 2 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/les deux magots 3.jpg" "les-deux-magots" 3 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/les deux magots 4.jpg" "les-deux-magots" 4 "jpg"

# ============================================================
# 8. CẦU MIRABEAU (mirabeau-bridge)
# Nguồn: CHƯƠNG 13,14,15,16 / Ảnh cầu Mirabeau (1-3).jpg
# ============================================================
create_dest "mirabeau-bridge"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Ảnh cầu Mirabeau (1).jpg" "mirabeau-bridge" 1 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Ảnh cầu Mirabeau (2).jpg" "mirabeau-bridge" 2 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Ảnh cầu Mirabeau (3).jpg" "mirabeau-bridge" 3 "jpg"

# ============================================================
# 9. QUẢNG TRƯỜNG PLACE VENDÔME (place-vendome)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "place-vendome"
# TODO: Thêm ảnh cho place-vendome
echo "   ⚠️  place-vendome: chưa có ảnh nguồn"

# ============================================================
# 10. SÔNG SEINE (seine-river)
# Nguồn: CHƯƠNG 13,14,15,16 (3 ảnh) + CHƯƠNG 17,18,19 (3 ảnh)
# ============================================================
create_dest "seine-river"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Ảnh sông Seine (1).jpg" "seine-river" 1 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Ảnh sông Seine (2).jpg" "seine-river" 2 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 13, 14, 15, 16 (MINH NGỌC)/Ảnh sông Seine (3).jpg" "seine-river" 3 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/Sông Seine, Pháp.jpg" "seine-river" 4 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/Sông Seine, Pháp 2.jpg" "seine-river" 5 "jpg"
copy_img "$SOURCE_DIR/CHƯƠNG 17, 18, 19 (THANH THU)/song-Seine.jpg" "seine-river" 6 "jpg"

# ============================================================
# 11. KHẢI HOÀN MÔN (arc-de-triomphe)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "arc-de-triomphe"
# TODO: Thêm ảnh cho arc-de-triomphe
echo "   ⚠️  arc-de-triomphe: chưa có ảnh nguồn"

# ============================================================
# 12. BẢO TÀNG LOUVRE (louvre-museum)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "louvre-museum"
# TODO: Thêm ảnh cho louvre-museum
echo "   ⚠️  louvre-museum: chưa có ảnh nguồn"

# ============================================================
# 13. NHÀ THỜ ĐỨC BÀ PARIS (notre-dame)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "notre-dame"
# TODO: Thêm ảnh cho notre-dame
echo "   ⚠️  notre-dame: chưa có ảnh nguồn"

# ============================================================
# 14. NHÀ THỜ SACRÉ-CŒUR (sacre-coeur)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "sacre-coeur"
# TODO: Thêm ảnh cho sacre-coeur
echo "   ⚠️  sacre-coeur: chưa có ảnh nguồn"

# ============================================================
# 15. KHU PHỐ MONTMARTRE (montmartre)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "montmartre"
# TODO: Thêm ảnh cho montmartre
echo "   ⚠️  montmartre: chưa có ảnh nguồn"

# ============================================================
# 16. KHU PHỐ LATIN (quartier-latin)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "quartier-latin"
# TODO: Thêm ảnh cho quartier-latin
echo "   ⚠️  quartier-latin: chưa có ảnh nguồn"

# ============================================================
# 17. SAINT-GERMAIN-DES-PRÉS (saint-germain-des-pres)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "saint-germain-des-pres"
# TODO: Thêm ảnh cho saint-germain-des-pres
echo "   ⚠️  saint-germain-des-pres: chưa có ảnh nguồn"

# ============================================================
# 18. VƯỜN LUXEMBOURG (jardin-du-luxembourg)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "jardin-du-luxembourg"
# TODO: Thêm ảnh cho jardin-du-luxembourg
echo "   ⚠️  jardin-du-luxembourg: chưa có ảnh nguồn"

# ============================================================
# 19. QUẢNG TRƯỜNG CONCORDE (place-de-la-concorde)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "place-de-la-concorde"
# TODO: Thêm ảnh cho place-de-la-concorde
echo "   ⚠️  place-de-la-concorde: chưa có ảnh nguồn"

# ============================================================
# 20. CẦU PONT NEUF (pont-neuf)
# ❌ CHƯA CÓ ẢNH TRONG FILE TREE - cần bổ sung sau
# ============================================================
create_dest "pont-neuf"
# TODO: Thêm ảnh cho pont-neuf
echo "   ⚠️  pont-neuf: chưa có ảnh nguồn"

# ============================================================
# 📊 TỔNG KẾT
# ============================================================
echo ""
echo "=========================================="
echo "✅ HOÀN TẤT!"
echo "=========================================="
echo ""
echo "📁 Kiểm tra kết quả tại: $DEST_DIR/"
echo ""
echo "🔍 Các địa điểm đã có ảnh:"
for slug in eiffel-tower alexandre-iii-bridge bercy-park champs-elysees les-deux-magots mirabeau-bridge seine-river; do
    count=$(ls -1 "$DEST_DIR/$slug" 2>/dev/null | wc -l)
    echo "   - $slug: $count ảnh"
done
echo ""
echo "⚠️  Các địa điểm CẦN BỔ SUNG ẢNH:"
echo "   - faubourg-saint-honore"
echo "   - gare-de-lyon"
echo "   - place-vendome"
echo "   - arc-de-triomphe"
echo "   - louvre-museum"
echo "   - notre-dame"
echo "   - sacre-coeur"
echo "   - montmartre"
echo "   - quartier-latin"
echo "   - saint-germain-des-pres"
echo "   - jardin-du-luxembourg"
echo "   - place-de-la-concorde"
echo "   - pont-neuf"
echo ""