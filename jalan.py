#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
GameKU Development Installer
Installer otomatis untuk project GameKU (Cross-platform: Linux & Windows)
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

# Sistem operasi
SYSTEM_OS = platform.system()

# Daftar distribusi Linux yang didukung
LINUX_DISTROS = ["debian", "ubuntu", "linuxmint", "mx", "kali", "pop"]


def dapatkan_warna_rgb(latar: bool = False) -> str:
    """Menghasilkan kode warna RGB acak untuk efek rainbow"""
    if latar:
        r = random.randint(0, 128)
        g = random.randint(0, 128)
        b = random.randint(0, 128)
    else:
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
    durasi = 2.5
    
    while time.time() - start_time < durasi:
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
    
    info['nama_komputer'] = platform.node()
    info['sistem_operasi'] = platform.system()
    info['versi_kernel'] = platform.release()
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
    
    info['arsitektur'] = platform.machine()
    
    try:
        info['hostname'] = socket.gethostname()
    except Exception:
        info['hostname'] = "Tidak terdeteksi"
    
    info['direktori_project'] = str(PROJECT_ROOT)
    
    try:
        hostname = socket.gethostname()
        info['ip_lokal'] = socket.gethostbyname(hostname)
    except Exception:
        info['ip_lokal'] = "Tidak terdeteksi"
    
    info.update(dapatkan_info_internet())
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
        pass
    
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


def cek_package_json(jalur: Path) -> tuple:
    """Memeriksa apakah file package.json ada dan valid"""
    if not jalur.exists():
        return False, "Tidak valid"
    
    try:
        with open(jalur, 'r') as f:
            data = json.load(f)
            if 'name' in data:
                return True, "Valid"
            return False, "Tidak valid"
    except Exception:
        return False, "Error baca file"


def cek_nodejs() -> tuple:
    """Memeriksa apakah Node.js terpasang"""
    try:
        hasil = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, hasil.stdout.strip()
        return False, "Tidak terpasang"
    except Exception:
        return False, "Tidak terpasang"


def cek_npm() -> tuple:
    """Memeriksa apakah npm terpasang"""
    try:
        hasil = subprocess.run(['npm', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, hasil.stdout.strip()
        return False, "Tidak terpasang"
    except Exception:
        return False, "Tidak terpasang"


def cek_git() -> tuple:
    """Memeriksa apakah Git terpasang"""
    try:
        hasil = subprocess.run(['git', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, hasil.stdout.strip().split()[-1]
        return False, "Tidak terpasang"
    except Exception:
        return False, "Tidak terpasang"


def cek_mongodb() -> tuple:
    """Memeriksa apakah MongoDB terpasang"""
    try:
        hasil = subprocess.run(['mongod', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, "Terpasang"
        hasil = subprocess.run(['mongosh', '--version'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0:
            return True, "Terpasang"
        hasil = subprocess.run(['which', 'mongod'], capture_output=True, text=True, timeout=5)
        if hasil.returncode == 0 and hasil.stdout.strip():
            return True, "Terpasang"
    except Exception:
        pass
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


def cek_dependency_terpasang(node_modules_path: Path) -> bool:
    """Memeriksa apakah node_modules sudah terpasang"""
    if node_modules_path.exists() and node_modules_path.is_dir():
        package_lock = node_modules_path.parent / "package-lock.json"
        if package_lock.exists():
            return True
        try:
            items = list(node_modules_path.iterdir())
            if len(items) > 0:
                return True
        except:
            pass
    return False


def tampilkan_status_component(nama: str, status: bool, pesan: str, level: int = 0) -> None:
    """Menampilkan status komponen dengan indentasi"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_merah = "\033[38;2;255;100;100m"
    
    indent = "  " * level
    if status:
        print(f"{indent}{warna_hijau}✓ {nama:<20}: {pesan}{ANSI_RESET}")
    else:
        print(f"{indent}{warna_merah}✗ {nama:<20}: {pesan}{ANSI_RESET}")


def normalisasi_hasil_pemeriksaan(nama_fungsi: str, hasil) -> tuple:
    """Menyamakan hasil pemeriksaan menjadi tuple (bool, str)"""
    if isinstance(hasil, tuple) and len(hasil) == 2:
        return hasil
    
    if isinstance(hasil, bool):
        return (hasil, "Terdeteksi" if hasil else "Tidak terdeteksi")
    
    if isinstance(hasil, str):
        return (True, hasil)
    
    return (False, f"Tipe tidak dikenal: {type(hasil).__name__}")


# ============================================
# CROSS-PLATFORM FUNCTIONS
# ============================================

def dapatkan_distro_linux() -> str:
    """Mendeteksi distribusi Linux yang digunakan"""
    if SYSTEM_OS != "Linux":
        return ""
    
    try:
        # Coba baca /etc/os-release
        if Path("/etc/os-release").exists():
            with open("/etc/os-release", 'r') as f:
                content = f.read().lower()
                if "ubuntu" in content or "debian" in content:
                    return "debian"
                if "mint" in content:
                    return "linuxmint"
                if "mx" in content:
                    return "mx"
                if "kali" in content:
                    return "kali"
                if "pop" in content:
                    return "pop"
    except Exception:
        pass
    
    return "debian"  # Default asumsikan debian-based


def cek_admin_windows() -> bool:
    """Memeriksa apakah script berjalan sebagai Administrator di Windows"""
    if SYSTEM_OS != "Windows":
        return True  # Bukan Windows, tidak perlu admin
    
    try:
        import ctypes
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except Exception:
        return False


def restart_sebagai_admin_windows() -> None:
    """Menjalankan ulang installer sebagai Administrator di Windows"""
    import ctypes
    
    argv = [sys.executable] + [str(PROJECT_ROOT / "jalan.py")] + sys.argv[1:]
    
    try:
        ctypes.windll.shell32.ShellExecuteW(
            None, "runas", sys.executable, " ".join(argv), None, 1
        )
    except Exception as e:
        print(f"Error: Gagal restart sebagai Administrator: {e}")
        sys.exit(1)


def cek_package_manager_windows() -> str:
    """Mendeteksi package manager yang tersedia di Windows"""
    if SYSTEM_OS != "Windows":
        return ""
    
    # Cek winget
    try:
        hasil = subprocess.run(["winget", "--version"], capture_output=True, timeout=5)
        if hasil.returncode == 0:
            return "winget"
    except Exception:
        pass
    
    # Cek chocolatey
    try:
        hasil = subprocess.run(["choco", "--version"], capture_output=True, timeout=5)
        if hasil.returncode == 0:
            return "choco"
    except Exception:
        pass
    
    # Cek scoop
    try:
        hasil = subprocess.run(["scoop", "--version"], capture_output=True, timeout=5)
        if hasil.returncode == 0:
            return "scoop"
    except Exception:
        pass
    
    return ""


def instalasi_apt_linux(daftar_package: list) -> tuple:
    """Menginstal paket di Linux dengan apt"""
    if not daftar_package:
        return True, "Tidak ada paket yang perlu diinstal"
    
    try:
        subprocess.run(
            "apt-get update -qq",
            shell=True,
            capture_output=True,
            timeout=120
        )
        
        perintah = f"DEBIAN_FRONTEND=noninteractive apt-get install -y {' '.join(daftar_package)}"
        hasil = subprocess.run(
            perintah,
            shell=True,
            capture_output=True,
            text=True,
            timeout=300
        )
        if hasil.returncode == 0:
            return True, "Berhasil diinstal"
        return False, f"Gagal: {hasil.stderr[:200]}"
    except Exception as e:
        return False, f"Error: {str(e)}"


def instalasi_winget(daftar_package: list) -> tuple:
    """Menginstal paket di Windows dengan winget"""
    if not daftar_package:
        return True, "Tidak ada paket yang perlu diinstal"
    
    try:
        for paket in daftar_package:
            # winget install -h (silent) -e (exact)
            perintah = ["winget", "install", "-h", "-e", "--id", paket]
            hasil = subprocess.run(
                perintah,
                capture_output=True,
                text=True,
                timeout=300
            )
            if hasil.returncode != 0:
                return False, f"Gagal: {hasil.stderr[:200]}"
        
        return True, "Berhasil diinstal"
    except Exception as e:
        return False, f"Error: {str(e)}"


def instalasi_choco(daftar_package: list) -> tuple:
    """Menginstal paket di Windows dengan chocolatey"""
    if not daftar_package:
        return True, "Tidak ada paket yang perlu diinstal"
    
    try:
        perintah = ["choco", "install", "-y"] + daftar_package
        hasil = subprocess.run(
            perintah,
            capture_output=True,
            text=True,
            timeout=300
        )
        if hasil.returncode == 0:
            return True, "Berhasil diinstal"
        return False, f"Gagal: {hasil.stderr[:200]}"
    except Exception as e:
        return False, f"Error: {str(e)}"


def instalasi_scoop(daftar_package: list) -> tuple:
    """Menginstal paket di Windows dengan scoop"""
    if not daftar_package:
        return True, "Tidak ada paket yang perlu diinstal"
    
    try:
        for paket in daftar_package:
            perintah = ["scoop", "install", paket]
            hasil = subprocess.run(
                perintah,
                capture_output=True,
                text=True,
                timeout=300
            )
            if hasil.returncode != 0:
                return False, f"Gagal: {hasil.stderr[:200]}"
        
        return True, "Berhasil diinstal"
    except Exception as e:
        return False, f"Error: {str(e)}"


def instalasi_paket_umum(paket_list: list) -> tuple:
    """Menginstal paket menggunakan package manager yang sesuai sistem operasi"""
    if SYSTEM_OS == "Linux":
        return instalasi_apt_linux(paket_list)
    elif SYSTEM_OS == "Windows":
        pm = cek_package_manager_windows()
        if pm == "winget":
            return instalasi_winget(paket_list)
        elif pm == "choco":
            return instalasi_choco(paket_list)
        elif pm == "scoop":
            return instalasi_scoop(paket_list)
        else:
            return False, "Tidak ada package manager yang tersedia (winget/choco/scoop)"
    else:
        return False, f"Sistem operasi {SYSTEM_OS} tidak didukung"


def minta_sudo() -> bool:
    """Meminta hak akses sudo untuk instalasi yang memerlukan administrator"""
    warna_merah = "\033[38;2;255;100;100m"
    warna_kuning = "\033[38;2;255;255;100m"
    
    print(f"{warna_kuning}Installer memerlukan hak Administrator untuk menginstal dependency sistem.{ANSI_RESET}")
    print(f"{warna_kuning}Silakan masukkan password sudo Anda...{ANSI_RESET}")
    
    try:
        hasil = subprocess.run(
            ["sudo", "-n", "true"],
            capture_output=True,
            timeout=10
        )
        if hasil.returncode != 0:
            hasil = subprocess.run(
                ["sudo", "true"],
                capture_output=True,
                timeout=60
            )
        
        if hasil.returncode == 0:
            return True
        return False
    except Exception:
        return False


def restart_sebagai_root() -> None:
    """Menjalankan ulang installer sebagai root"""
    argv = ["sudo", sys.executable] + [str(PROJECT_ROOT / "jalan.py")] + sys.argv[1:]
    
    try:
        os.execvp("sudo", argv)
    except Exception as e:
        print(f"Error: Gagal menjalankan installer sebagai root: {e}")
        sys.exit(1)


def cek_root() -> bool:
    """Memeriksa apakah script berjalan sebagai root (Administrator)"""
    if SYSTEM_OS == "Windows":
        return cek_admin_windows()
    return os.geteuid() == 0


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


def tampilkan_pemeriksaan_awal() -> dict:
    """Menampilkan hasil pemeriksaan sistem awal"""
    garis = "═" * 64
    
    print(f"{garis}")
    print("                     PEMERIKSAAN SISTEM")
    print(f"{garis}")
    print()
    
    pemeriksaan = jalankan_pemeriksaan()
    
    for nama, hasil in pemeriksaan.items():
        label = nama.replace('_', ' ').title()
        status, pesan = normalisasi_hasil_pemeriksaan(nama, hasil)
        tampilkan_status_component(label, status, pesan)
    
    return pemeriksaan


def proses_instalasi_component() -> None:
    """Memproses instalasi component yang belum terpasang"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print()
    print(f"{warna_hijau}Memproses instalasi component...{ANSI_RESET}")
    print()
    
    component_list = [
        ('Node.js & npm', cek_nodejs, cek_npm, ['node_js', 'npm']),
        ('Git', cek_git, None, ['git']),
        ('MongoDB', cek_mongodb, None, ['mongodb']),
    ]
    
    for nama_component, cek_func1, cek_func2, keys in component_list:
        sudah_terpasang = True
        
        for key in keys:
            if key == 'node_js':
                status, _ = cek_nodejs()
            elif key == 'npm':
                status, _ = cek_npm()
            elif key == 'git':
                status, _ = cek_git()
            elif key == 'mongodb':
                status, _ = cek_mongodb()
            
            if not status:
                sudah_terpasang = False
                break
        
        if sudah_terpasang:
            print(f"{warna_hijau}✓ {nama_component:<20}: Sudah Terpasang{ANSI_RESET}")
        else:
            print(f"{warna_kuning}Sedang menginstal {nama_component}...{ANSI_RESET}")
            
            # Tentukan paket berdasarkan sistem operasi
            if nama_component == 'Node.js & npm':
                if SYSTEM_OS == "Linux":
                    paket_list = ['nodejs', 'npm']
                elif SYSTEM_OS == "Windows":
                    paket_list = ['OpenJS.NodeJS', 'Git.Git']  # winget IDs
                else:
                    paket_list = []
            elif nama_component == 'Git':
                if SYSTEM_OS == "Linux":
                    paket_list = ['git']
                elif SYSTEM_OS == "Windows":
                    paket_list = ['Git.Git']
                else:
                    paket_list = []
            elif nama_component == 'MongoDB':
                if SYSTEM_OS == "Linux":
                    paket_list = ['mongodb-org']
                elif SYSTEM_OS == "Windows":
                    paket_list = ['MongoDB.Server']
                else:
                    paket_list = []
            else:
                paket_list = []
            
            sukses, pesan = instalasi_paket_umum(paket_list)
            
            if not sukses:
                print(f"{warna_merah}Gagal: {pesan}. Mencoba ulang...{ANSI_RESET}")
                sukses, pesan = instalasi_paket_umum(paket_list)
            
            if sukses:
                time.sleep(1)
                sudah_terpasang_ulang = True
                for key in keys:
                    if key == 'node_js':
                        status, _ = cek_nodejs()
                    elif key == 'npm':
                        status, _ = cek_npm()
                    elif key == 'git':
                        status, _ = cek_git()
                    elif key == 'mongodb':
                        status, _ = cek_mongodb()
                    
                    if not status:
                        sudah_terpasang_ulang = False
                        break
                
                if sudah_terpasang_ulang:
                    print(f"{warna_hijau}✓ {nama_component:<20}: Berhasil diinstal{ANSI_RESET}")
                else:
                    print(f"{warna_merah}✗ {nama_component:<20}: Instalasi gagal, melanjutkan ke component berikutnya{ANSI_RESET}")
            else:
                print(f"{warna_merah}✗ {nama_component:<20}: Instalasi gagal, melanjutkan ke component berikutnya{ANSI_RESET}")


def npm_install_ya(lokasi: Path) -> tuple:
    """Menjalankan npm install dalam mode non-interaktif"""
    try:
        perintah = "npm install --no-fund --no-audit --silent"
        hasil = subprocess.run(
            perintah,
            shell=True,
            capture_output=True,
            text=True,
            cwd=lokasi,
            timeout=600,
            env={**os.environ, 'npm_config_yes': 'true', 'DEBIAN_FRONTEND': 'noninteractive'}
        )
        if hasil.returncode == 0:
            return True, "Berhasil diinstal"
        return False, hasil.stderr[:300] if hasil.stderr else hasil.stdout[:300]
    except subprocess.TimeoutExpired:
        return False, "Timeout: Proses terlalu lama"
    except Exception as e:
        return False, str(e)


def instalasi_dependency_frontend_backend() -> None:
    """Menginstal dependency frontend dan backend secara otomatis"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print()
    print(f"{warna_hijau}Memasang dependency frontend dan backend...{ANSI_RESET}")
    print()
    
    root_node_modules = PROJECT_ROOT / "node_modules"
    if not cek_dependency_terpasang(root_node_modules):
        print(f"{warna_kuning}Sedang menginstal dependency root...{ANSI_RESET}")
        sukses, pesan = npm_install_ya(PROJECT_ROOT)
        
        if not sukses:
            print(f"{warna_merah}Gagal: {pesan}. Mencoba ulang...{ANSI_RESET}")
            sukses, pesan = npm_install_ya(PROJECT_ROOT)
        
        if sukses:
            time.sleep(1)
            if cek_dependency_terpasang(root_node_modules):
                print(f"{warna_hijau}✓ Dependency root     : Berhasil diinstal{ANSI_RESET}")
            else:
                print(f"{warna_merah}✗ Dependency root     : Instalasi gagal, melanjutkan{ANSI_RESET}")
        else:
            print(f"{warna_merah}✗ Dependency root     : Instalasi gagal, melanjutkan{ANSI_RESET}")
    else:
        print(f"{warna_hijau}✓ Dependency root     : Sudah Terpasang{ANSI_RESET}")
    
    frontend_node_modules = PROJECT_ROOT / "frontend" / "node_modules"
    frontend_path = PROJECT_ROOT / "frontend"
    
    if frontend_path.exists() and not cek_dependency_terpasang(frontend_node_modules):
        print(f"{warna_kuning}Sedang menginstal dependency frontend...{ANSI_RESET}")
        sukses, pesan = npm_install_ya(frontend_path)
        
        if not sukses:
            print(f"{warna_merah}Gagal: {pesan}. Mencoba ulang...{ANSI_RESET}")
            sukses, pesan = npm_install_ya(frontend_path)
        
        if sukses:
            time.sleep(1)
            if cek_dependency_terpasang(frontend_node_modules):
                print(f"{warna_hijau}✓ Dependency frontend  : Berhasil diinstal{ANSI_RESET}")
            else:
                print(f"{warna_merah}✗ Dependency frontend  : Instalasi gagal, melanjutkan{ANSI_RESET}")
        else:
            print(f"{warna_merah}✗ Dependency frontend  : Instalasi gagal, melanjutkan{ANSI_RESET}")
    elif frontend_path.exists():
        print(f"{warna_hijau}✓ Dependency frontend  : Sudah Terpasang{ANSI_RESET}")
    else:
        print(f"{warna_merah}✗ Dependency frontend  : Folder frontend tidak tersedia{ANSI_RESET}")
    
    backend_node_modules = PROJECT_ROOT / "backend" / "node_modules"
    backend_path = PROJECT_ROOT / "backend"
    
    if backend_path.exists() and not cek_dependency_terpasang(backend_node_modules):
        print(f"{warna_kuning}Sedang menginstal dependency backend...{ANSI_RESET}")
        sukses, pesan = npm_install_ya(backend_path)
        
        if not sukses:
            print(f"{warna_merah}Gagal: {pesan}. Mencoba ulang...{ANSI_RESET}")
            sukses, pesan = npm_install_ya(backend_path)
        
        if sukses:
            time.sleep(1)
            if cek_dependency_terpasang(backend_node_modules):
                print(f"{warna_hijau}✓ Dependency backend   : Berhasil diinstal{ANSI_RESET}")
            else:
                print(f"{warna_merah}✗ Dependency backend   : Instalasi gagal, melanjutkan{ANSI_RESET}")
        else:
            print(f"{warna_merah}✗ Dependency backend   : Instalasi gagal, melanjutkan{ANSI_RESET}")
    elif backend_path.exists():
        print(f"{warna_hijau}✓ Dependency backend   : Sudah Terpasang{ANSI_RESET}")
    else:
        print(f"{warna_merah}✗ Dependency backend   : Folder backend tidak tersedia{ANSI_RESET}")


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
    
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    
    for folder in folder_storage:
        jalur = PROJECT_ROOT / folder
        if not jalur.exists():
            jalur.mkdir(parents=True, exist_ok=True)
            print(f"{warna_kuning}Folder dibuat:{ANSI_RESET} {folder}")
        else:
            print(f"{warna_hijau}Folder sudah ada:{ANSI_RESET} {folder}")


def bersihkan_cache() -> None:
    """Membersihkan cache yang aman tanpa menghapus database"""
    warna_kuning = "\033[38;2;255;255;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    print(f"{warna_kuning}Membersihkan cache yang aman...{ANSI_RESET}")
    
    vite_cache = PROJECT_ROOT / "node_modules" / ".vite"
    if vite_cache.exists():
        shutil.rmtree(vite_cache)
        print(f"{warna_hijau}Cache dihapus:{ANSI_RESET} node_modules/.vite")
    
    temp_folder = PROJECT_ROOT / "temp"
    if temp_folder.exists():
        shutil.rmtree(temp_folder)
        print(f"{warna_hijau}Folder temp dihapus{ANSI_RESET}")
    
    for file in PROJECT_ROOT.glob("*.tmp"):
        file.unlink()
        print(f"{warna_hijau}File temporary dihapus:{ANSI_RESET} {file.name}")
    
    for file in PROJECT_ROOT.glob("*.temp"):
        file.unlink()
        print(f"{warna_hijau}File temporary dihapus:{ANSI_RESET} {file.name}")
    
    print(f"{warna_hijau}Pembersihan cache selesai.{ANSI_RESET}")


def validasi_project() -> bool:
    """Memvalidasi project setelah instalasi"""
    warna_merah = "\033[38;2;255;100;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    print(f"{warna_hijau}Memvalidasi project...{ANSI_RESET}")
    
    root_node_modules = PROJECT_ROOT / "node_modules"
    frontend_node_modules = PROJECT_ROOT / "frontend" / "node_modules"
    backend_node_modules = PROJECT_ROOT / "backend" / "node_modules"
    
    valid = True
    
    if not cek_dependency_terpasang(root_node_modules):
        print(f"{warna_merah}Error: node_modules root tidak ditemukan.{ANSI_RESET}")
        valid = False
    
    if not cek_dependency_terpasang(frontend_node_modules):
        print(f"{warna_merah}Error: node_modules frontend tidak ditemukan.{ANSI_RESET}")
        valid = False
    
    if not cek_dependency_terpasang(backend_node_modules):
        print(f"{warna_merah}Error: node_modules backend tidak ditemukan.{ANSI_RESET}")
        valid = False
    
    _, status_root = cek_package_json(PROJECT_ROOT / "package.json")
    if status_root != "Valid":
        print(f"{warna_merah}Error: package.json root tidak valid.{ANSI_RESET}")
        valid = False
    
    _, status_frontend = cek_package_json(PROJECT_ROOT / "frontend" / "package.json")
    if status_frontend != "Valid":
        print(f"{warna_merah}Error: package.json frontend tidak valid.{ANSI_RESET}")
        valid = False
    
    _, status_backend = cek_package_json(PROJECT_ROOT / "backend" / "package.json")
    if status_backend != "Valid":
        print(f"{warna_merah}Error: package.json backend tidak valid.{ANSI_RESET}")
        valid = False
    
    folder_wajib = [
        PROJECT_ROOT / "storage",
        PROJECT_ROOT / "frontend"
    ]
    
    for folder in folder_wajib:
        if not folder.exists():
            print(f"{warna_merah}Error: Folder {folder.name} tidak tersedia.{ANSI_RESET}")
            valid = False
    
    if valid:
        print(f"{warna_hijau}Validasi project selesai. Semua dependency terpasang.{ANSI_RESET}")
    
    return valid


# ============================================
# MENU FUNCTIONS
# ============================================

def tampilkan_menu_utama() -> None:
    """Menampilkan menu utama GameKU"""
    garis = "═" * 64
    warna_biru = "\033[38;2;100;150;255m"
    
    print(f"{warna_biru}{garis}{ANSI_RESET}")
    print(f"{warna_biru}                    MENU GAMEKU                            {warna_biru}")
    print(f"{warna_biru}{garis}{ANSI_RESET}")
    print(f"{warna_biru}[1] Jalankan Development Server                          {warna_biru}")
    print(f"{warna_biru}[2] Jalankan Ulang Pemeriksaan Dependency                {warna_biru}")
    print(f"{warna_biru}[3] Install / Perbaiki Dependency                        {warna_biru}")
    print(f"{warna_biru}[4] Push Project ke GitHub                               {warna_biru}")
    print(f"{warna_biru}[5] Bersihkan Cache Project                            {warna_biru}")
    print(f"{warna_biru}[6] Build Project                                      {warna_biru}")
    print(f"{warna_biru}[7] Informasi Sistem                                   {warna_biru}")
    print(f"{warna_biru}[8] Tentang GameKU                                     {warna_biru}")
    print(f"{warna_biru}[9] Keluar                                             {warna_biru}")
    print(f"{warna_biru}{garis}{ANSI_RESET}")
    print()


def jalankan_dev_server() -> bool:
    """Menjalankan development server npm run dev"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_merah = "\033[38;2;255;100;100m"
    
    try:
        # Jalankan npm run dev dari root project
        hasil = subprocess.run(
            ["npm", "run", "dev"],
            cwd=PROJECT_ROOT
        )
        return True
    except KeyboardInterrupt:
        return True
    except Exception as e:
        print(f"{warna_merah}Gagal menjalankan development server: {e}{ANSI_RESET}")
        return False


def jalankan_pemeriksaan_dependency() -> None:
    """Menjalankan pemeriksaan dependency (dipanggil dari menu)"""
    warna_hijau = "\033[38;2;100;255;150m"
    
    print(f"{warna_hijau}Memeriksa dependency...{ANSI_RESET}")
    print()
    
    pemeriksaan = jalankan_pemeriksaan()
    
    for nama, hasil in pemeriksaan.items():
        label = nama.replace('_', ' ').title()
        status, pesan = normalisasi_hasil_pemeriksaan(nama, hasil)
        tampilkan_status_component(label, status, pesan)


def install_perbaiki_dependency() -> None:
    """Install atau perbaiki dependency yang belum terpasang"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print(f"{warna_hijau}Memasang / memperbaiki dependency...{ANSI_RESET}")
    print()
    
    # Cek dan install dependency frontend
    frontend_node_modules = PROJECT_ROOT / "frontend" / "node_modules"
    frontend_path = PROJECT_ROOT / "frontend"
    
    if frontend_path.exists() and not cek_dependency_terpasang(frontend_node_modules):
        print(f"{warna_kuning}Sedang menginstal dependency frontend...{ANSI_RESET}")
        sukses, pesan = npm_install_ya(frontend_path)
        if sukses:
            print(f"{warna_hijau}✓ Dependency frontend  : Berhasil diinstal{ANSI_RESET}")
        else:
            print(f"{warna_merah}✗ Dependency frontend  : Gagal - {pesan}{ANSI_RESET}")
    else:
        print(f"{warna_hijau}✓ Dependency frontend  : Sudah Terpasang{ANSI_RESET}")
    
    # Cek dan install dependency backend
    backend_node_modules = PROJECT_ROOT / "backend" / "node_modules"
    backend_path = PROJECT_ROOT / "backend"
    
    if backend_path.exists() and not cek_dependency_terpasang(backend_node_modules):
        print(f"{warna_kuning}Sedang menginstal dependency backend...{ANSI_RESET}")
        sukses, pesan = npm_install_ya(backend_path)
        if sukses:
            print(f"{warna_hijau}✓ Dependency backend   : Berhasil diinstal{ANSI_RESET}")
        else:
            print(f"{warna_merah}✗ Dependency backend   : Gagal - {pesan}{ANSI_RESET}")
    else:
        print(f"{warna_hijau}✓ Dependency backend   : Sudah Terpasang{ANSI_RESET}")
    
    # Cek dan install dependency root
    root_node_modules = PROJECT_ROOT / "node_modules"
    
    if not cek_dependency_terpasang(root_node_modules):
        print(f"{warna_kuning}Sedang menginstal dependency root...{ANSI_RESET}")
        sukses, pesan = npm_install_ya(PROJECT_ROOT)
        if sukses:
            print(f"{warna_hijau}✓ Dependency root     : Berhasil diinstal{ANSI_RESET}")
        else:
            print(f"{warna_merah}✗ Dependency root     : Gagal - {pesan}{ANSI_RESET}")
    else:
        print(f"{warna_hijau}✓ Dependency root     : Sudah Terpasang{ANSI_RESET}")


def push_github() -> None:
    """Push project ke GitHub dengan validasi lengkap"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_merah = "\033[38;2;255;100;100m"
    warna_kuning = "\033[38;2;255;255;100m"
    
    print(f"{warna_hijau}Push Project ke GitHub{ANSI_RESET}")
    print()
    
    # Cek apakah git terpasang
    git_terpasang, _ = cek_git()
    if not git_terpasang:
        print(f"{warna_merah}Git tidak terpasang. Tidak dapat melakukan push ke GitHub.{ANSI_RESET}")
        return
    
    # 1. Pastikan direktori merupakan repository Git
    if not (PROJECT_ROOT / ".git").exists():
        print(f"{warna_kuning}Folder .git tidak ditemukan. Menginisialisasi repository Git...{ANSI_RESET}")
        try:
            hasil_init = subprocess.run(
                ["git", "init"],
                cwd=PROJECT_ROOT,
                capture_output=True,
                text=True,
                timeout=60
            )
            if hasil_init.returncode != 0:
                print(f"{warna_merah}Gagal menginisialisasi Git: {hasil_init.stderr}{ANSI_RESET}")
                return
            print(f"{warna_hijau}Repository Git berhasil diinisialisasi.{ANSI_RESET}")
        except Exception as e:
            print(f"{warna_merah}Gagal menginisialisasi Git: {e}{ANSI_RESET}")
            return
    
    # 2. Konfigurasi remote origin
    remote_yang_diharapkan = "git@github.com:maizarsec1337/GameKU.git"
    
    try:
        hasil_remote = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if hasil_remote.returncode != 0:
            print(f"{warna_kuning}Menambahkan remote origin...{ANSI_RESET}")
            hasil_add_remote = subprocess.run(
                ["git", "remote", "add", "origin", remote_yang_diharapkan],
                cwd=PROJECT_ROOT,
                capture_output=True,
                text=True,
                timeout=60
            )
            if hasil_add_remote.returncode != 0:
                print(f"{warna_merah}Gagal menambahkan remote origin: {hasil_add_remote.stderr}{ANSI_RESET}")
                return
            print(f"{warna_hijau}Remote origin berhasil ditambahkan.{ANSI_RESET}")
        else:
            remote_url = hasil_remote.stdout.strip()
            if remote_url != remote_yang_diharapkan:
                print(f"{warna_kuning}URL remote berbeda. Mengupdate ke URL yang benar...{ANSI_RESET}")
                hasil_set_remote = subprocess.run(
                    ["git", "remote", "set-url", "origin", remote_yang_diharapkan],
                    cwd=PROJECT_ROOT,
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if hasil_set_remote.returncode != 0:
                    print(f"{warna_merah}Gagal mengupdate remote origin: {hasil_set_remote.stderr}{ANSI_RESET}")
                    return
                print(f"{warna_hijau}Remote origin berhasil diupdate.{ANSI_RESET}")
            else:
                print(f"{warna_hijau}Remote GitHub sudah dikonfigurasi.{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}Gagal memeriksa remote Git: {e}{ANSI_RESET}")
        return
    
    # 3. Periksa user.name Git
    try:
        hasil_name = subprocess.run(
            ["git", "config", "--global", "user.name"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if hasil_name.returncode != 0 or not hasil_name.stdout.strip():
            print()
            print("Konfigurasi Git user.name belum ada.")
            print("Masukkan nama Anda:")
            nama = input("> ").strip()
            
            if not nama:
                print(f"{warna_merah}Nama tidak boleh kosong. Push dibatalkan.{ANSI_RESET}")
                return
            
            hasil_set_name = subprocess.run(
                ["git", "config", "--global", "user.name", nama],
                cwd=PROJECT_ROOT,
                capture_output=True,
                text=True,
                timeout=30
            )
            if hasil_set_name.returncode != 0:
                print(f"{warna_merah}Gagal mengatur user.name: {hasil_set_name.stderr}{ANSI_RESET}")
                return
            print(f"{warna_hijau}Git user.name berhasil diatur.{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}Gagal mengecek user.name Git: {e}{ANSI_RESET}")
        return
    
    # 4. Periksa user.email Git
    try:
        hasil_email = subprocess.run(
            ["git", "config", "--global", "user.email"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if hasil_email.returncode != 0 or not hasil_email.stdout.strip():
            print()
            print("Konfigurasi Git user.email belum ada.")
            print("Masukkan email Anda:")
            email = input("> ").strip()
            
            if not email:
                print(f"{warna_merah}Email tidak boleh kosong. Push dibatalkan.{ANSI_RESET}")
                return
            
            hasil_set_email = subprocess.run(
                ["git", "config", "--global", "user.email", email],
                cwd=PROJECT_ROOT,
                capture_output=True,
                text=True,
                timeout=30
            )
            if hasil_set_email.returncode != 0:
                print(f"{warna_merah}Gagal mengatur user.email: {hasil_set_email.stderr}{ANSI_RESET}")
                return
            print(f"{warna_hijau}Git user.email berhasil diatur.{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}Gagal mengecek user.email Git: {e}{ANSI_RESET}")
        return
    
    # 5. Jalankan git add .
    print()
    print(f"{warna_kuning}Menjalankan: git add .{ANSI_RESET}")
    try:
        hasil_add = subprocess.run(
            ["git", "add", "."],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if hasil_add.returncode != 0:
            print(f"{warna_merah}Gagal menjalankan git add: {hasil_add.stderr}{ANSI_RESET}")
            return
    except Exception as e:
        print(f"{warna_merah}Gagal menjalankan git add: {e}{ANSI_RESET}")
        return
    
    # 6. Periksa apakah ada perubahan menggunakan git status --porcelain
    try:
        hasil_status = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if hasil_status.returncode != 0:
            print(f"{warna_merah}Gagal mengecek status Git: {hasil_status.stderr}{ANSI_RESET}")
            return
        
        if not hasil_status.stdout.strip():
            print(f"{warna_kuning}Tidak ada perubahan yang perlu dikirim ke GitHub.{ANSI_RESET}")
            return
        
        # Hitung jumlah baris yang berubah
        changed_lines = hasil_status.stdout.strip().split("\n") if hasil_status.stdout.strip() else []
        print(f"{warna_hijau}Ditemukan {len(changed_lines)} file yang berubah.{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}Gagal mengecek status Git: {e}{ANSI_RESET}")
        return
    
    # Minta deskripsi commit
    print()
    print("Masukkan deskripsi commit:")
    deskripsi = input("> ").strip()
    
    if not deskripsi:
        deskripsi = "Update project"
    
    # 8. Jalankan git commit
    print()
    print(f"{warna_kuning}Menjalankan: git commit -m \"{deskripsi}\"{ANSI_RESET}")
    try:
        hasil_commit = subprocess.run(
            ["git", "commit", "-m", deskripsi],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if hasil_commit.returncode != 0:
            # Tampilkan seluruh output stderr dan stdout
            error_output = []
            if hasil_commit.stderr:
                error_output.append(hasil_commit.stderr)
            if hasil_commit.stdout:
                error_output.append(hasil_commit.stdout)
            
            error_msg = "\n".join(error_output) if error_output else "Tidak diketahui"
            print(f"{warna_merah}Gagal menjalankan git commit:{ANSI_RESET}")
            print(error_msg)
            return
        
        print(f"{warna_hijau}Commit berhasil dibuat.{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}Gagal menjalankan git commit: {e}{ANSI_RESET}")
        return
    
    # 10. Jalankan git push
    print()
    print(f"{warna_kuning}Menjalankan: git push{ANSI_RESET}")
    try:
        hasil_push = subprocess.run(
            ["git", "push"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if hasil_push.returncode != 0:
            # Tampilkan penyebab sebenarnya
            error_output = []
            if hasil_push.stderr:
                error_output.append(hasil_push.stderr)
            if hasil_push.stdout:
                error_output.append(hasil_push.stdout)
            
            error_msg = "\n".join(error_output) if error_output else "Tidak diketahui"
            
            print(f"{warna_merah}Gagal push ke GitHub.{ANSI_RESET}")
            
            # Cek jenis error untuk memberikan solusi
            error_lower = error_msg.lower()
            if "authentication" in error_lower or "login" in error_lower or "credential" in error_lower or "permission denied" in error_lower:
                print(f"{warna_merah}Penyebab: Kredensial GitHub tidak valid atau SSH key belum dikonfigurasi.{ANSI_RESET}")
                print(f"{warna_kuning}Solusi: Setup SSH key atau gunakan Personal Access Token.{ANSI_RESET}")
            else:
                print(f"{warna_merah}Penyebab: {error_msg}{ANSI_RESET}")
            return
        
        print(f"{warna_hijau}Project berhasil dikirim ke GitHub.{ANSI_RESET}")
    except subprocess.TimeoutExpired:
        print(f"{warna_merah}Timeout: Proses git push terlalu lama.{ANSI_RESET}")
        return
    except Exception as e:
        print(f"{warna_merah}Gagal menjalankan git push: {e}{ANSI_RESET}")
        return


def bersihkan_cache_lengkap() -> None:
    """Membersihkan semua cache project secara lengkap"""
    warna_kuning = "\033[38;2;255;255;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print(f"{warna_kuning}Membersihkan cache project...{ANSI_RESET}")
    print()
    
    # Folder yang TIDAK boleh dihapus
    folder_dilindungi = ["storage", "uploads", "database", "gambar", "images"]
    
    # Bersihkan npm cache
    try:
        hasil = subprocess.run(
            ["npm", "cache", "clean", "--force"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=60
        )
        if hasil.returncode == 0:
            print(f"{warna_hijau}Cache dihapus: npm cache{ANSI_RESET}")
        else:
            print(f"{warna_kuning}npm cache: {hasil.stderr if hasil.stderr else 'Selesai'}{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}Gagal membersihkan npm cache: {e}{ANSI_RESET}")
    
    # Bersihkan vite cache (hanya di frontend)
    vite_cache = PROJECT_ROOT / "node_modules" / ".vite"
    if vite_cache.exists():
        try:
            shutil.rmtree(vite_cache)
            print(f"{warna_hijau}Cache dihapus: node_modules/.vite{ANSI_RESET}")
        except Exception as e:
            print(f"{warna_merah}Gagal menghapus vite cache: {e}{ANSI_RESET}")
    
    # Bersihkan node_modules/.vite di frontend
    vite_cache_frontend = PROJECT_ROOT / "frontend" / "node_modules" / ".vite"
    if vite_cache_frontend.exists():
        try:
            shutil.rmtree(vite_cache_frontend)
            print(f"{warna_hijau}Cache dihapus: frontend/node_modules/.vite{ANSI_RESET}")
        except Exception as e:
            print(f"{warna_merah}Gagal menghapus vite cache frontend: {e}{ANSI_RESET}")
    
    # Bersihkan cache temporary (hanya di root, hindari folder dilindungi)
    cache_patterns = ["*.tmp", "*.temp", "*.cache", "*~"]
    
    for pattern in cache_patterns:
        for file in PROJECT_ROOT.glob(pattern):
            # Lewati jika file berada di folder dilindungi
            try:
                rel_path = file.relative_to(PROJECT_ROOT)
                skip = False
                for protected in folder_dilindungi:
                    if str(rel_path).startswith(protected):
                        skip = True
                        break
                
                if not skip:
                    file.unlink()
                    print(f"{warna_hijau}File temporary dihapus: {file.name}{ANSI_RESET}")
            except Exception:
                pass
    
    # Bersihkan folder temp di root (jika ada, hindari folder dilindungi)
    temp_folder = PROJECT_ROOT / "temp"
    if temp_folder.exists() and temp_folder.is_dir():
        try:
            shutil.rmtree(temp_folder)
            print(f"{warna_hijau}Folder dihapus: temp{ANSI_RESET}")
        except Exception as e:
            print(f"{warna_merah}Gagal menghapus folder temp: {e}{ANSI_RESET}")
    
    # Bersihkan dist/build cache di frontend
    dist_folder = PROJECT_ROOT / "frontend" / "dist"
    if dist_folder.exists() and dist_folder.is_dir():
        try:
            rel_path = dist_folder.relative_to(PROJECT_ROOT)
            skip = False
            for protected in folder_dilindungi:
                if str(rel_path).startswith(protected):
                    skip = True
                    break
            
            if not skip:
                shutil.rmtree(dist_folder)
                print(f"{warna_hijau}Folder dihapus: frontend/dist{ANSI_RESET}")
        except Exception:
            pass
    
    print(f"{warna_hijau}Pembersihan cache selesai.{ANSI_RESET}")


def build_project() -> None:
    """Melakukan build project frontend dan backend"""
    warna_hijau = "\033[38;2;100;255;150m"
    warna_kuning = "\033[38;2;255;255;100m"
    warna_merah = "\033[38;2;255;100;100m"
    
    print(f"{warna_hijau}Build Project{ANSI_RESET}")
    print()
    
    # Build frontend
    print(f"{warna_kuning}Building frontend...{ANSI_RESET}")
    try:
        hasil = subprocess.run(
            ["npm", "run", "build"],
            cwd=PROJECT_ROOT / "frontend",
            capture_output=True,
            text=True,
            timeout=300
        )
        if hasil.returncode == 0:
            print(f"{warna_hijau}✓ Frontend build berhasil{ANSI_RESET}")
        else:
            error_msg = hasil.stderr[:200] if hasil.stderr else hasil.stdout[:200]
            print(f"{warna_merah}✗ Frontend build gagal: {error_msg}{ANSI_RESET}")
    except subprocess.TimeoutExpired:
        print(f"{warna_merah}✗ Frontend build timeout{ANSI_RESET}")
    except Exception as e:
        print(f"{warna_merah}✗ Frontend build gagal: {e}{ANSI_RESET}")
    
    # Build backend (jika ada script build)
    backend_package = PROJECT_ROOT / "backend" / "package.json"
    if backend_package.exists():
        print(f"{warna_kuning}Building backend...{ANSI_RESET}")
        try:
            # Cek apakah ada script build di backend
            with open(backend_package, 'r') as f:
                data = json.load(f)
                if "build" in data.get("scripts", {}):
                    hasil = subprocess.run(
                        ["npm", "run", "build"],
                        cwd=PROJECT_ROOT / "backend",
                        capture_output=True,
                        text=True,
                        timeout=300
                    )
                    if hasil.returncode == 0:
                        print(f"{warna_hijau}✓ Backend build berhasil{ANSI_RESET}")
                    else:
                        error_msg = hasil.stderr[:200] if hasil.stderr else hasil.stdout[:200]
                        print(f"{warna_merah}✗ Backend build gagal: {error_msg}{ANSI_RESET}")
                else:
                    print(f"{warna_kuning}Backend tidak memiliki script build, dilewati.{ANSI_RESET}")
        except Exception as e:
            print(f"{warna_kuning}Backend: {e}{ANSI_RESET}")
    
    print(f"{warna_hijau}Build project selesai.{ANSI_RESET}")


def tampilkan_tentang_gameku() -> None:
    """Menampilkan informasi tentang GameKU"""
    garis = "═" * 64
    warna_biru = "\033[38;2;100;150;255m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    print(f"{warna_biru}{garis}{ANSI_RESET}")
    print(f"{warna_biru}                     TENTANG GAMEKU                           {warna_biru}")
    print(f"{warna_biru}{garis}{ANSI_RESET}")
    print()
    
    print(f"{warna_biru}Nama Project    :{ANSI_RESET} {warna_hijau}GameKU Development Installer{ANSI_RESET}")
    print(f"{warna_biru}Versi           :{ANSI_RESET} {warna_hijau}{INSTALLER_VERSI}{ANSI_RESET}")
    print(f"{warna_biru}Developer       :{ANSI_RESET} {warna_hijau}Maizar Sec 1337{ANSI_RESET}")
    print(f"{warna_biru}Framework       :{ANSI_RESET} {warna_hijau}React • Node.js • MongoDB • Firebase{ANSI_RESET}")
    github = "https://github.com/maizarsec1337/GameKU"
    print(f"{warna_biru}Github          :{ANSI_RESET} {warna_hijau}{github}{ANSI_RESET}")
    print(f"{warna_biru}Status          :{ANSI_RESET} {warna_hijau}ONLINE{ANSI_RESET}")
    print()


def tunggu_tombol_enter() -> None:
    """Menunggu pengguna menekan Enter untuk kembali ke menu"""
    input("Tekan Enter untuk kembali ke menu...")


def proses_menu() -> bool:
    """Memproses pilihan menu, mengembalikan False jika ingin keluar"""
    warna_merah = "\033[38;2;255;100;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    while True:
        tampilkan_menu_utama()
        pilihan = input("Pilih menu [1-9]: ").strip()
        
        if pilihan == "1":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            jalankan_dev_server()
            bersihkan_terminal()
            
        elif pilihan == "2":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            jalankan_pemeriksaan_dependency()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "3":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            install_perbaiki_dependency()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "4":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            push_github()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "5":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            bersihkan_cache_lengkap()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "6":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            build_project()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "7":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            tampilkan_info_sistem()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "8":
            bersihkan_terminal()
            tampilkan_logo_rainbow()
            tampilkan_info_instaler()
            tampilkan_tentang_gameku()
            tunggu_tombol_enter()
            bersihkan_terminal()
            
        elif pilihan == "9":
            garis = "═" * 64
            print(f"{warna_hijau}{garis}{ANSI_RESET}")
            print(f"{warna_hijau}Terima kasih telah menggunakan GameKU Development Installer.{ANSI_RESET}")
            print(f"{warna_hijau}{garis}{ANSI_RESET}")
            print()
            return False
            
        else:
            print(f"{warna_merah}Pilihan tidak valid! Masukkan angka 1-9.{ANSI_RESET}")
            time.sleep(1)
            bersihkan_terminal()
    
    return True


def main() -> None:
    """Fungsi utama installer"""
    warna_merah = "\033[38;2;255;100;100m"
    warna_kuning = "\033[38;2;255;255;100m"
    warna_hijau = "\033[38;2;100;255;150m"
    
    # Deteksi sistem operasi
    distro = dapatkan_distro_linux()
    
    # Cek apakah berjalan sebagai admin/root
    if not cek_root():
        print(f"{warna_kuning}Installer memerlukan hak Administrator.{ANSI_RESET}")
        
        if SYSTEM_OS == "Linux":
            print(f"{warna_kuning}Meminta akses sudo...{ANSI_RESET}")
            if not minta_sudo():
                print(f"{warna_merah}Akses sudo ditolak atau gagal. Installer tidak dapat melanjutkan.{ANSI_RESET}")
                print(f"{warna_merah}Silakan jalankan installer dengan hak Administrator (sudo).{ANSI_RESET}")
                sys.exit(1)
            restart_sebagai_root()
            return
        elif SYSTEM_OS == "Windows":
            print(f"{warna_kuning}Meminta hak Administrator...{ANSI_RESET}")
            restart_sebagai_root()
            return
        else:
            print(f"{warna_merah}Sistem operasi {SYSTEM_OS} tidak didukung.{ANSI_RESET}")
            sys.exit(1)
    
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
    
    # Tampilkan logo rainbow lagi setelah konfirmasi
    tampilkan_logo_rainbow()
    
    # Tampilkan info installer lagi
    tampilkan_info_instaler()
    
    # Jalankan pemeriksaan awal
    tampilkan_pemeriksaan_awal()
    
    # Proses instalasi component yang belum terpasang
    proses_instalasi_component()
    
    # Buat folder storage
    print()
    buat_folder_storage()
    
    # Instalasi dependency frontend dan backend
    instalasi_dependency_frontend_backend()
    
    # Bersihkan cache
    print()
    bersihkan_cache()
    
    # Validasi project
    print()
    validasi_project()
    
    # Bersihkan terminal terakhir
    bersihkan_terminal()
    
    # Tampilkan logo rainbow terakhir
    tampilkan_logo_rainbow()
    
    # Tampilkan status final
    garis = "═" * 64
    
    print(f"{warna_hijau}{garis}{ANSI_RESET}")
    print(f"{warna_hijau}Semua dependency berhasil diverifikasi!{ANSI_RESET}")
    print(f"{warna_hijau}{garis}{ANSI_RESET}")
    print()
    
    # Tampilkan menu utama setelah instalasi selesai
    proses_menu()


if __name__ == "__main__":
    main()