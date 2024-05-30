from app.model.admin import Admin
from werkzeug.security import generate_password_hash, check_password_hash

# Buat password uji
test_password = "my_secret_password"
hashed_password = generate_password_hash(test_password)

print(f"Password uji: {test_password}")
print(f"Password yang di-hash: {hashed_password}")

# Periksa password
is_correct = check_password_hash(hashed_password, test_password)
print(f"Password benar: {is_correct}")

# Periksa password yang salah
is_incorrect = check_password_hash(hashed_password, "wrong_password")
print(f"Password benar: {is_incorrect}")
