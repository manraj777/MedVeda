# save as scripts/extract_remedies.py
import re
import csv
import pdfplumber

# 1) Update these paths:
PDF_PATH = "medveda-backend\scripts\medveda_data.pdf"
CSV_PATH = "medveda-backend/remedies/data/remedies_full_dataset.csv"

# 2) Define regex patterns to identify fields
REMEDY_HEADING = re.compile(r"•Remedy\s*\d+[:\s–]*(.+)")
ING_PATTERN    = re.compile(r"Ingredients?[:\s]*(.+)")
PREP_PATTERN   = re.compile(r"Preparation?[:\s]*(.+)")
BENEFITS_PATTERN = re.compile(r"Health Benefits?[:\s]*(.+)")
CATEGORY_DEFAULT = "General"

def extract_remedies(pdf_path):
    remedies = []
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"

    # Split by each remedy bullet
    chunks = re.split(r"•Remedy\s*\d+", text)[1:]
    for chunk in chunks:
        lines = [l.strip() for l in chunk.splitlines() if l.strip()]
        title = lines[0]
        ingredients = prep = benefits = ""
        # Join the rest into one block, then search
        body = " ".join(lines[1:])
        ing_m = ING_PATTERN.search(body)
        prep_m = PREP_PATTERN.search(body)
        ben_m = BENEFITS_PATTERN.search(body)
        if ing_m:    ingredients = ing_m.group(1).strip()
        if prep_m:   prep        = prep_m.group(1).strip()
        if ben_m:    benefits    = ben_m.group(1).strip()

        remedies.append({
            "title":           title,
            "description":     "",
            "ingredients":     ingredients,
            "preparation":     prep,
            "health_benefits": benefits,
            "category":        CATEGORY_DEFAULT,
            "image_url":       "",
            "rating":          "",
        })
    return remedies

def save_csv(remedies, csv_path):
    fieldnames = [
        "title","description","ingredients",
        "preparation","health_benefits",
        "category","image_url","rating"
    ]
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in remedies:
            writer.writerow(r)

if __name__ == "__main__":
    remedies = extract_remedies(PDF_PATH)
    save_csv(remedies, CSV_PATH)
    print(f"Extracted {len(remedies)} remedies → {CSV_PATH}")
