from django.shortcuts import render


def home(request):
    return render(request, "index.html")


def product_page(request):
    return render(request, "product.html")


def announcements_page(request):
    return render(request, "announcements.html")


def cart_page(request):
    return render(request, "cart.html")


def checkout_page(request):
    return render(request, "checkout.html")


def login_page(request):
    return render(request, "login.html")


def register_page(request):
    return render(request, "register.html")


def profile_page(request):
    return render(request, "profile.html")