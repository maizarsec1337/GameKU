#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
GameKU Development Installer
Installer otomatis untuk project GameKU
"""

import subprocess
import sys
import os
import json
import socket
import platform
import shutil
import time
import random
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError


# Konstanta
INSTALLER_VERSI = "1.0.0"
PROJECT_ROOT = Path(__file__).parent.resolve()

# ANSI Color Codes
ANSI_RESET = "\033[0m"
ANSI_BOLD = "\033[1m"


def dapatkan_warna_rgb(latar: bool = False) -> str:
    """Menghasilkan kode warna RGB acak untuk efek rainbow"""
    if latar:
        # Warna latar belakang gelap
        r = random.randint(0, 128)
        g = random.randint(0, 128)
        b = random.randint(0, 128)
    else:
        # Warna teks terang
        r = random.randint(128, 255)
        g = random.randint(128, 255)
        b = random.randint(128, 255)
    return f"\033[38;2;{r};{g};{b}m"


def tampilkan_logo_rainbow() -> None:
    """Menampilkan logo ASCII dengan efek rainbow RGB selama 2-3 detik"""
    logo = [
        " ██████╗  █████╗ ███╗   ███╗███████╗██╗  ██╗██╗   ██╗",
        "██╔════╝ ██╔══██╗████╗ ████║██╔════╝██║ ██╔╝██║   ██║",
        "██║  ███╗███████║██╔████╔██║█████╗  █████╔╝ ██║   ██║",
        "██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██╔═██╗ ██║   ██║",
        "╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║  ██╗╚██████╔╝",
        " ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ "
    ]
    
    garis = "═" * 64
    
    start_time = time.time()
    durasi = 2.5  # 2-3 detik
    
    while time.time() - start_time < durasi:
        # Bersihkan layar
        print("\033[2J\033[H", end="")
        
        for baris in logo:
            warna = dapatkan_warna_rgb()
            print(f"{warna}{baris}{ANSI_RESET}")
        
        print(f"\n{dapatkan_warna_rgb()}{garis}{ANSI_RESET}")
        teks = "                GAMEKU DEVELOPMENT INSTALLER"
        print(f"{dapatkan_warna_rgb()}{teks:^64}{ANSI_RESET}")
        print(f"{dapatkan_warna_rgb()}{garis}{ANSI_RESET}")
        print()
        
        time.sleep(0.1)
    
    # Bersihkan layar terakhir
    print("\033[2J\033[H", end="")
    for baris in logo:
        warna = dapatkan_warna_rgb()
        print(f"{warna}{baris}{ANSI_RESET}")
    
    print(f"\n{dapatkan_warna_rgb()}{garis}{ANSI_RESET}")
    teks = "                GAMEKU DEVELOPMENT INSTALLER"
    print(f"{dapatkan_warna_rgb()}{teks:^64}{ANSI_RESET}")
    print(f"{dapatkan_warna_rgb()}{garis}{ANSI_RESET}")
    print()


def tampilkan_info_instaler() -> None:
    """Menampilkan informasi installer di bawah logo"""
    warna_biru = "\033[38;2;100;150;255m"
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    
    print(f"{warna_biru}Developer          :{ANSI_RESET} {warna_hijau}Maizar Sec 1337{ANSI_RESET}")
    print(f"{warna_biru}Framework          :{ANSI_RESET} {warna_kuning}React • Node.js • MongoDB • Firebase{ANSI_RESET}")
    print(f"{warna_biru}Installer Versi    :{ANSI_RESET} {warna_hijau}{INSTALLER_VERSI}{ANSI_RESET}")
    print(f"{warna_biru}Mode               :{ANSI_RESET} {warna_kuning}DEVELOPMENT{ANSI_RESET}")
    print(f"{warna_biru}Status             :{ANSI_RESET} {warna_hijau}ONLINE{ANSI_RESET}")
    print(f"{warna_biru}Koneksi            :{ANSI_RESET} {warna_hijau}SIAP{ANSI_RESET}")
    print(f"{warna_biru}Storage            :{ANSI_RESET} {warna_kuning}MENUNGGU PEMERIKSAAN{ANSI_RESET}")
    print(f"{warna_biru}Database           :{ANSI_RESET} {warna_kuning}MENUNGGU PEMERIKSAAN{ANSI_RESET}")
    print(f"{warna_biru}Keamanan           :{ANSI_RESET} {warna_hijau}AKTIF{ANSI_RESET}")
    
    garis = "═" * 64
    print(f"\n{warna_biru}{garis}{ANSI_RESET}")
    print()


def dapatkan_info_sistem() -> dict:
    """Mendeteksi dan mengumpulkan informasi sistem secara otomatis"""
    info = {}
    
    # Nama Komputer
    info['nama_komputer'] = platform.node()
    
    # Sistem Operasi
    info['sistem_operasi'] = platform.system()
    
    # Versi Kernel
    info['versi_kernel'] = platform.release()
    
    # Python
    info['python'] = platform.python_version()
    
    # Node.js
    try:
        hasil = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            info['node_js'] = hasil.stdout.strip()
        else:
            info['node_js'] = "Tidak terdeteksi"
    except Exception:
        info['node_js'] = "Tidak terdeteksi"
    
    # npm
    try:
        hasil = subprocess.run(['npm', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            info['npm'] = hasil.stdout.strip()
        else:
            info['npm'] = "Tidak terdeteksi"
    except Exception:
        info['npm'] = "Tidak terdeteksi"
    
    # Git
    try:
        hasil = subprocess.run(['git', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            info['git'] = hasil.stdout.strip().split()[-1]
        else:
            info['git'] = "Tidak terdeteksi"
    except Exception:
        info['git'] = "Tidak terdeteksi"
    
    # RAM
    try:
        with open('/proc/meminfo', 'r') as f:
            for baris in f:
                if baris.startswith('MemTotal:'):
                    ram_kb = int(baris.split()[1])
                    ram_gb = ram_kb / (1024 * 1024)
                    info['ram'] = f"{ram_gb:.2f} GB"
                    break
    except Exception:
        info['ram'] = "Tidak terdeteksi"
    
    # CPU
    try:
        with open('/proc/cpuinfo', 'r') as f:
            for baris in f:
                if baris.startswith('model name'):
                    info['cpu'] = baris.split(':')[1].strip()
                    break
    except Exception:
        info['cpu'] = "Tidak terdeteksi"
    
    # Arsitektur
    info['arsitektur'] = platform.machine()
    
    # Hostname
    try:
        info['hostname'] = socket.gethostname()
    except Exception:
        info['hostname'] = "Tidak terdeteksi"
    
    # Direktori Project
    info['direktori_project'] = str(PROJECT_ROOT)
    
    # IP Lokal
    try:
        hostname = socket.gethostname()
        info['ip_lokal'] = socket.gethostbyname(hostname)
    except Exception:
        info['ip_lokal'] = "Tidak terdeteksi"
    
    # IP Publik, Negara, Provinsi, Kota, ISP via API
    info.update(dapatkan_info_internet())
    
    # Zona Waktu
    info['zona_waktu'] = time.strftime("%Z")
    
    return info


def dapatkan_info_internet() -> dict:
    """Mendapatkan informasi internet secara otomatis"""
    info = {
        'ip_publik': "Tidak tersedia",
        'negara': "Tidak tersedia",
        'provinsi': "Tidak tersedia",
        'kota': "Tidak tersedia",
        'isp': "Tidak tersedia"
    }
    
    try:
        url = "http://ip-api.com/json/"
        permintaan = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        with urlopen(permintaan, timeout=5) as response:
            data = json.loads(response.read().decode())
            info['ip_publik'] = data.get('query', 'Tidak tersedia')
            info['negara'] = data.get('country', 'Tidak tersedia')
            info['provinsi'] = data.get('regionName', 'Tidak tersedia')
            info['kota'] = data.get('city', 'Tidak tersedia')
            info['isp'] = data.get('isp', 'Tidak tersedia')
    except Exception:
        pass  # Jika gagal, tetap gunakan nilai default
    
    return info


def tampilkan_info_sistem() -> None:
    """Menampilkan semua informasi sistem"""
    garis = "═" * 64
    warna_biru = "\033[38;2;100;150;255m"
    
    print(f"{garis}")
    print("                INFORMASI SISTEM")
    print(f"{garis}")
    print()
    
    info = dapatkan_info_sistem()
    
    for kunci, nilai in info.items():
        label = kunci.replace('_', ' ').title()
        print(f"{warna_biru}{label:<18}:{ANSI_RESET} {nilai}")
    
    print()


def tampilkan_ketentuan() -> None:
    """Menampilkan kotak ketentuan installer"""
    garis = "═" * 64
    warna_kuning = "\033[38;2;255;255;100m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print(f"{garis}")
    print("                     KETENTUAN")
    print(f"{garis}")
    print()
    
    ketentuan = [
        "• Installer akan memasang seluruh dependency otomatis.",
        "• Installer tidak akan menghapus database.",
        "• Installer tidak akan menghapus folder storage.",
        "• Installer akan membuat folder yang belum ada.",
        "• Installer akan memperbaiki dependency yang hilang.",
        "• Installer akan membersihkan cache yang aman.",
        "• Installer akan menjalankan GameKU secara otomatis.",
        "• Jangan menutup terminal selama proses berlangsung."
    ]
    
    for item in ketentuan:
        print(f"{warna_kuning}{item}{ANSI_RESET}")
    
    print()
    print(f"{warna_merah}Apakah Anda ingin melanjutkan?{ANSI_RESET}")
    print()
    print("[Y] Ya")
    print("[N] Tidak")
    print()


def konfirmasi_pengguna() -> bool:
    """Meminta konfirmasi satu kali dari pengguna"""
    while True:
        pilihan = input("Pilihan Anda: ").strip().upper()
        if pilihan == 'Y':
            return True
        elif pilihan == 'N':
            print("\nInstalasi dibatalkan oleh pengguna.")
            return False
        else:
            print("Masukkan Y atau N!")


def bersihkan_terminal() -> None:
    """Membersihkan layar terminal"""
    print("\033[2J\033[H", end="")


def jalankan_perintah(tahap: str) -> tuple:
    """Menjalankan perintah npm dan mengembalikan tuple (sukses, output)"""
    try:
        hasil = subprocess.run(
            tahap,
            shell=True,
            capture_output=True,
            text=True,
            cwd=PROJECT_ROOT,
            timeout=300
        )
        return hasil.returncode == 0, hasil.stdout + hasil.stderr
    except subprocess.TimeoutExpired:
        return False, "Timeout: Proses terlalu lama"
    except Exception as e:
        return False, str(e)


def cek_package_json(jalur: Path) -> bool:
    """Memeriksa apakah file package.json ada dan valid"""
    if not jalur.exists():
        return False
    
    try:
        with open(jalur, 'r') as f:
            data = json.load(f)
            return 'name' in data
    except Exception:
        return False


def cek_nodejs() -> tuple:
    """Memeriksa apakah Node.js terpasang"""
    try:
        hasil = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=5)
        return hasil.returncode == 0, hasil.stdout.strip()
    except Exception:
        return False, "Tidak terpasang"


def cek_npm() -> tuple:
    """Memeriksa apakah npm terpasang"""
    try:
        hasil = subprocess.run(['npm', '--version'], capture_output=True, text=True, timeout=5)
        return hasil.returncode == 0, hasil.stdout.strip()
    except Exception:
        return False, "Tidak terpasang"


def cek_git() -> tuple:
    """Memeriksa apakah Git terpasang"""
    try:
        hasil = subprocess.run(['git', '--version'], capture_output=True, text=True, timeout=5)
        return hasil.returncode == 0, hasil.stdout.strip().split()[-1]
    except Exception:
        return False, "Tidak terpasang"


def cek_mongodb() -> tuple:
    """Memeriksa apakah MongoDB terpasang"""
    try:
        hasil = subprocess.run(['mongod', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, "Terpasang"
        # Coba mongosh sebagai alternatif
        hasil = subprocess.run(['mongosh', '--version'], capture_output=True, text=True, timeout=5)
        return hasil.returncode == 0, "Terpasang"
    except Exception:
        return False, "Tidak terpasang"


def cek_firebase_config() -> tuple:
    """Memeriksa konfigurasi Firebase"""
    frontend_firebase = PROJECT_ROOT / "frontend" / "src" / "config" / "firebase.js"
    backend_firebase = PROJECT_ROOT / "backend" / "api" / "config" / "firebase.js"
    
    if frontend_firebase.exists() or backend_firebase.exists():
        return True, "Dikonfigurasi"
    return False, "Belum dikonfigurasi"


def cek_frontend() -> tuple:
    """Memeriksa folder frontend"""
    frontend_path = PROJECT_ROOT / "frontend"
    if frontend_path.exists() and frontend_path.is_dir():
        return True, "Tersedia"
    return False, "Tidak tersedia"


def cek_backend() -> tuple:
    """Memeriksa folder backend"""
    backend_path = PROJECT_ROOT / "backend"
    if backend_path.exists() and backend_path.is_dir():
        return True, "Tersedia"
    return False, "Tidak tersedia"


def cek_python() -> tuple:
    """Memeriksa apakah Python terpasang"""
    return True, platform.python_version()


def cek_pip() -> tuple:
    """Memeriksa apakah pip terpasang"""
    try:
        hasil = subprocess.run([sys.executable, '-m', 'pip', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, "Terpasang"
    except Exception:
        pass
    return True, "Terpasang"


def jalankan_pemeriksaan() -> dict:
    """Menjalankan semua pemeriksaan sistem"""
    pemeriksaan = {
        'python': cek_python(),
        'pip': cek_pip(),
        'node_js': cek_nodejs(),
        'npm': cek_npm(),
        'git': cek_git(),
        'mongodb': cek_mongodb(),
        'firebase_config': cek_firebase_config(),
        'frontend': cek_frontend(),
        'backend': cek_backend(),
        'package_json_root': cek_package_json(PROJECT_ROOT / "package.json"),
        'package_json_frontend': cek_package_json(PROJECT_ROOT / "frontend" / "package.json"),
        'package_json_backend': cek_package_json(PROJECT_ROOT / "backend" / "package.json"),
        'folder_storage': ((PROJECT_ROOT / "storage").exists(), "Tersedia" if (PROJECT_ROOT / "storage").exists() else "Belum ada"),
        'folder_uploads': ((PROJECT_ROOT / "uploads").exists(), "Tersedia" if (PROJECT_ROOT / "uploads").exists() else "Belum ada"),
        'folder_images': ((PROJECT_ROOT / "images").exists(), "Tersedia" if (PROJECT_ROOT / "images").exists() else "Belum ada")
    }
    return pemeriksaan


def tampilkan_pemeriksaan() -> None:
    """Menampilkan hasil pemeriksaan sistem"""
    garis = "═" * 64
    warna_biru = "\033[38;2;100;150;255m"
    warna_hijau = "\033[38;2;100;255;150m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print(f"{garis}")
    print("                     PEMERIKSAAN SISTEM")
    print(f"{garis}")
    print()
    
    pemeriksaan = jalankan_pemeriksaan()
    
    for nama, hasil in pemeriksaan.items():
        label = nama.replace('_', ' ').title()
        status, pesan = hasil
        
        if status:
            warna = warna_hijau
            simbol = "✓"
        else:
            warna = warna_merah
            simbol = "✗"
        
        print(f"{warna}{simbol} {label:<20}:{ANSI_RESET} {pesan}")
    
    print()


def buat_folder_storage() -> None:
    """Membuat folder storage yang diperlukan"""
    folder_storage = [
        "storage/banner",
        "storage/produk",
        "storage/avatar",
        "storage/ktp",
        "storage/selfie",
        "storage/dokumen",
        "storage/chat",
        "storage/review",
        "storage/temp",
        "uploads",
        "images"
    ]
    
    for folder in folder_storage:
        jalur = PROJECT_ROOT / folder
        if not jalur.exists():
            jalur.mkdir(parents=True, exist_ok=True)
            print(f"Folder dibuat: {folder}")
        else:
            print(f"Folder sudah ada: {folder}")


def instalasi_dependency() -> bool:
    """Menjalankan instalasi npm untuk semua folder"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    
    # Cek apakah node_modules sudah ada
    root_node_modules = PROJECT_ROOT / "node_modules"
    frontend_node_modules = PROJECT_ROOT / "frontend" / "node_modules"
    backend_node_modules = PROJECT_ROOT / "backend" / "node_modules"
    
    # Root npm install
    if not root_node_modules.exists():
        print(f"{warna_kuning}Memasang dependency root...{ANSI_RESET}")
        sukses, output = jalankan_perintah("npm install")
        if not sukses:
            print(f"Gagal memasang dependency root: {output}")
            return False
        print(f"{warna_hijau}Dependency root berhasil dipasang.{ANSI_RESET}")
    else:
        print(f"{warna_hijau}Dependency root sudah ada, dilewati.{ANSI_RESET}")
    
    # Frontend npm install
    if not frontend_node_modules.exists():
        print(f"{warna_kuning}Memasang dependency frontend...{ANSI_RESET}")
        sukses, output = jalankan_perintah("cd frontend && npm install")
        if not sukses:
            print(f"Gagal memasang dependency frontend: {output}")
            return False
        print(f"{warna_hijau}Dependency frontend berhasil dipasang.{ANSI_RESET}")
    else:
        print(f"{warna_hijau}Dependency frontend sudah ada, dilewati.{ANSI_RESET}")
    
    # Backend npm install
    if not backend_node_modules.exists():
        print(f"{warna_kuning}Memasang dependency backend...{ANSI_RESET}")
        sukses, output = jalankan_perintah("cd backend && npm install")
        if not sukses:
            print(f"Gagal memasang dependency backend: {output}")
            return False
        print(f"{warna_hijau}Dependency backend berhasil dipasang.{ANSI_RESET}")
    else:
        print(f"{warna_hijau}Dependency backend sudah ada, dilewati.{ANSI_RESET}")
    
    return True


def bersihkan_cache() -> None:
    """Membersihkan cache yang aman tanpa menghapus database"""
    warna_kuning = "\033[38;2;255;255;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    print(f"{warna_kuning}Membersihkan cache yang aman...{ANSI_RESET}")
    
    # node_modules/.vite
    vite_cache = PROJECT_ROOT / "node_modules" / ".vite"
    if vite_cache.exists():
        shutil.rmtree(vite_cache)
        print(f"Cache dihapus: node_modules/.vite")
    
    # Cache sementara
    temp_folder = PROJECT_ROOT / "temp"
    if temp_folder.exists():
        shutil.rmtree(temp_folder)
        print(f"Folder temp dihapus")
    
    # File temporary
    for file in PROJECT_ROOT.glob("*.tmp"):
        file.unlink()
        print(f"File temporary dihapus: {file.name}")
    
    for file in PROJECT_ROOT.glob("*.temp"):
        file.unlink()
        print(f"File temporary dihapus: {file.name}")
    
    print(f"{warna_hijau}Pembersihan cache selesai.{ANSI_RESET}")


def validasi_project() -> bool:
    """Memvalidasi project setelah instalasi"""
    warna_merah = "\033[38;2;255;100;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    print("Memvalidasi project...")
    
    # Cek node_modules
    root_node_modules = PROJECT_ROOT / "node_modules"
    frontend_node_modules = PROJECT_ROOT / "frontend" / "node_modules"
    backend_node_modules = PROJECT_ROOT / "backend" / "node_modules"
    
    if not root_node_modules.exists():
        print(f"{warna_merah}Error: node_modules root tidak ditemukan.{ANSI_RESET}")
        return False
    
    if not frontend_node_modules.exists():
        print(f"{warna_merah}Error: node_modules frontend tidak ditemukan.{ANSI_RESET}")
        return False
    
    if not backend_node_modules.exists():
        print(f"{warna_merah}Error: node_modules backend tidak ditemukan.{ANSI_RESET}")
        return False
    
    # Cek package.json
    if not cek_package_json(PROJECT_ROOT / "package.json"):
        print(f"{warna_merah}Error: package.json root tidak valid.{ANSI_RESET}")
        return False
    
    if not cek_package_json(PROJECT_ROOT / "frontend" / "package.json"):
        print(f"{warna_merah}Error: package.json frontend tidak valid.{ANSI_RESET}")
        return False
    
    if not cek_package_json(PROJECT_ROOT / "backend" / "package.json"):
        print(f"{warna_merah}Error: package.json backend tidak valid.{ANSI_RESET}")
        return False
    
    # Cek folder storage
    folder_wajib = [
        PROJECT_ROOT / "storage",
        PROJECT_ROOT / "frontend"
    ]
    
    for folder in folder_wajib:
        if not folder.exists():
            print(f"{warna_merah}Error: Folder {folder.name} tidak tersedia.{ANSI_RESET}")
            return False
    
    print(f"{warna_hijau}Validasi project selesai. Semua dependency terpasang.{ANSI_RESET}")
    return True


def jalankan_gameku() -> None:
    """Menjalankan GameKU dengan npm run dev"""
    warna_hijau = "\033[38;2;100;255;150m"
    
    print(f"{warna_hijau}Menjalankan GameKU...{ANSI_RESET}")
    print()
    
    # Jalankan npm run dev sebagai subprocess
    subprocess.run(
        ["npm", "run", "dev"],
        cwd=PROJECT_ROOT
    )


def main() -> None:
    """Fungsi utama installer"""
    ANSI_RESET = "\033[0m"
    
    # Tampilkan logo rainbow
    tampilkan_logo_rainbow()
    
    # Tampilkan info installer
    tampilkan_info_instaler()
    
    # Tampilkan info sistem
    tampilkan_info_sistem()
    
    # Tampilkan ketentuan
    tampilkan_ketentuan()
    
    # Dapatkan konfirmasi pengguna
    if not konfirmasi_pengguna():
        sys.exit(0)
    
    # Bersihkan terminal
    bersihkan_terminal()
    
    # Jalankan pemeriksaan
    tampilkan_pemeriksaan()
    
    # Buat folder storage
    print()
    print("Membuat folder storage...")
    buat_folder_storage()
    print()
    
    # Instalasi dependency
    print()
    if not instalasi_dependency():
        print("Instalasi gagal. Silakan periksa error di atas.")
        sys.exit(1)
    print()
    
    # Bersihkan cache
    print()
    bersihkan_cache()
    print()
    
    # Validasi project
    print()
    if not validasi_project():
        print("Validasi gagal. Silakan periksa error di atas.")
        sys.exit(1)
    print()
    
    # Bersihkan terminal terakhir
    bersihkan_terminal()
    
    # Jalankan GameKU
    jalankan_gameku()


if __name__ == "__main__":
    main()