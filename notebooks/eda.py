import pandas as pd
import shap
import matplotlib.pyplot as plt
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE

from xgboost import XGBClassifier


# Load dataset
df = pd.read_csv("../data/student.csv", sep=",")
print(df.columns)

# Create target column
df['risk'] = df['G3'].apply(lambda x: 1 if x < 10 else 0)

# Convert categorical columns to numeric
df = pd.get_dummies(df, drop_first=True)

# Remove direct grade columns
df = df.drop(['G1', 'G2', 'G3'], axis=1)

# Features and target
X = df.drop('risk', axis=1)
y = df['risk']

joblib.dump(X.columns.tolist(), "../backend/model_columns.pkl")

# Split FIRST
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Apply SMOTE ONLY on training data
smote = SMOTE(random_state=42)

X_train_resampled, y_train_resampled = smote.fit_resample(
    X_train,
    y_train
)

# Create model
model = XGBClassifier(
    random_state=42,
    max_depth=5,
    learning_rate=0.1,
    n_estimators=200
)

# Train model
model.fit(X_train_resampled, y_train_resampled)

#Shap explainability
explainer = shap.Explainer(model)
shap_values = explainer(X_test)
shap.plots.bar(shap_values)

#joblib Thing
joblib.dump(model, "../backend/failsafe_model.pkl")
print("Model saved successfully!")

# Predict
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", accuracy)

print(classification_report(y_test, y_pred))

