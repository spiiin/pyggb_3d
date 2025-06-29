"""
Extracting numerical values from Dot product

This example demonstrates various ways to extract the numerical value
from a Dot object for further processing in Python.
"""

import math

# Create some vectors for dot product calculation
v1 = Vector(3, 4)  # Vector with length 5
v2 = Vector(1, 2)  # Another vector

# Calculate dot product
dot_result = Dot(v1, v2)  # Should give 3*1 + 4*2 = 11

print("Different ways to extract value from Dot object:")
print("=" * 50)

# Method 1: Using the .value property (RECOMMENDED)
numerical_value = dot_result.value
print(f"1. Using .value property: {numerical_value}")
print(f"   Type: {type(numerical_value)}")

# Method 2: Using float() conversion
float_value = float(dot_result)
print(f"2. Using float() conversion: {float_value}")
print(f"   Type: {type(float_value)}")

# Method 3: Direct arithmetic operations (automatically converts)
doubled = dot_result * 2
print(f"3. Arithmetic operation (dot * 2): {doubled}")
print(f"   Type: {type(doubled)}")

# Method 4: Using in mathematical operations
sum_with_number = dot_result + 5
print(f"4. Adding to number (dot + 5): {sum_with_number}")

# Method 5: Using in comparisons
print(f"5. Comparison (dot > 10): {dot_result > 10}")
print(f"   Comparison (dot == 11): {dot_result == 11}")

print("\nPractical usage examples:")
print("=" * 30)

# Example 1: Calculate angle using dot product
v3 = Vector(1, 0)  # Unit vector along x-axis
v4 = Vector(1, 1)  # Vector at 45 degrees

dot_product = Dot(v3, v4)
magnitude_v3 = math.sqrt(v3.x**2 + v3.y**2)
magnitude_v4 = math.sqrt(v4.x**2 + v4.y**2)

# cos(θ) = (v3 · v4) / (|v3| * |v4|)
cos_angle = dot_product.value / (magnitude_v3 * magnitude_v4)
angle_radians = math.acos(cos_angle)
angle_degrees = math.degrees(angle_radians)

print(f"Dot product of {(v3.x, v3.y)} and {(v4.x, v4.y)}: {dot_product.value}")
print(f"Angle between vectors: {angle_degrees:.1f}°")

# Example 2: Check if vectors are perpendicular
v5 = Vector(1, 0)   # Horizontal vector
v6 = Vector(0, 1)   # Vertical vector

dot_perpendicular = Dot(v5, v6)
is_perpendicular = abs(dot_perpendicular.value) < 1e-10  # Close to zero

print(f"\nVectors {(v5.x, v5.y)} and {(v6.x, v6.y)}:")
print(f"Dot product: {dot_perpendicular.value}")
print(f"Are perpendicular: {is_perpendicular}")

# Example 3: Calculate projection length
v7 = Vector(3, 4)   # Vector to project
v8 = Vector(1, 0)   # Vector to project onto

dot_projection = Dot(v7, v8)
magnitude_v8 = math.sqrt(v8.x**2 + v8.y**2)
projection_length = dot_projection.value / magnitude_v8

print(f"\nProjection of {(v7.x, v7.y)} onto {(v8.x, v8.y)}:")
print(f"Projection length: {projection_length}")

# Example 4: Using in conditional logic
dot_threshold = Dot(Vector(2, 3), Vector(1, 1))

if dot_threshold.value > 5:
    print(f"\nDot product {dot_threshold.value} is greater than 5")
    result_category = "large"
elif dot_threshold.value > 0:
    print(f"\nDot product {dot_threshold.value} is positive but ≤ 5")
    result_category = "small positive"
else:
    print(f"\nDot product {dot_threshold.value} is negative or zero")
    result_category = "non-positive"

print(f"Category: {result_category}")

# Example 5: Working with multiple dot products
vectors_list = [
    (Vector(1, 0), Vector(0, 1)),
    (Vector(1, 1), Vector(1, -1)),
    (Vector(2, 3), Vector(4, 5))
]

print(f"\nCalculating multiple dot products:")
for i, (va, vb) in enumerate(vectors_list):
    dot = Dot(va, vb)
    print(f"Dot {i+1}: {(va.x, va.y)} · {(vb.x, vb.y)} = {dot.value}")

# Example 6: Statistical analysis of dot products
dot_values = [Dot(Vector(i, i+1), Vector(i+1, i)).value for i in range(1, 6)]
average_dot = sum(dot_values) / len(dot_values)
max_dot = max(dot_values)
min_dot = min(dot_values)

print(f"\nStatistical analysis:")
print(f"Dot values: {dot_values}")
print(f"Average: {average_dot:.2f}")
print(f"Maximum: {max_dot}")
print(f"Minimum: {min_dot}") 