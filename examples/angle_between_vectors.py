"""
Angle between vectors example

This example demonstrates how to calculate angles between vectors
using the Angle() function.
"""

import math

# Create some vectors to work with
v1 = Vector(1, 0)        # Unit vector along x-axis
v2 = Vector(0, 1)        # Unit vector along y-axis
v3 = Vector(1, 1)        # Diagonal vector at 45°
v4 = Vector(-1, 1)       # Vector at 135°
v5 = Vector(3, 4)        # Arbitrary vector

# Set different colors for visualization
v1.color = "red"
v1.line_thickness = 3
v2.color = "green" 
v2.line_thickness = 3
v3.color = "blue"
v3.line_thickness = 3
v4.color = "purple"
v4.line_thickness = 3
v5.color = "orange"
v5.line_thickness = 3

# Calculate angles between different pairs of vectors
angle_v1_v2 = Angle(v1, v2)  # Should be π/2 (90°)
angle_v1_v3 = Angle(v1, v3)  # Should be π/4 (45°)
angle_v1_v4 = Angle(v1, v4)  # Should be 3π/4 (135°)
angle_v3_v4 = Angle(v3, v4)  # Should be π/2 (90°)
angle_v1_v5 = Angle(v1, v5)  # Angle to vector (3,4)

# Convert to degrees for easier understanding
def radians_to_degrees(rad):
    return rad * 180 / math.pi

print("Angle calculations:")
print(f"Angle between x-axis (1,0) and y-axis (0,1): {radians_to_degrees(angle_v1_v2):.1f}°")
print(f"Angle between x-axis (1,0) and diagonal (1,1): {radians_to_degrees(angle_v1_v3):.1f}°")
print(f"Angle between x-axis (1,0) and (-1,1): {radians_to_degrees(angle_v1_v4):.1f}°")
print(f"Angle between diagonal (1,1) and (-1,1): {radians_to_degrees(angle_v3_v4):.1f}°")
print(f"Angle between x-axis (1,0) and (3,4): {radians_to_degrees(angle_v1_v5):.1f}°")

# Create visual angle indicators (arcs)
# Note: We use points at the tips of vectors for reference
origin = Point(0, 0, size=8, color="black")
tip_v1 = Point(1, 0, size=6, color="red")
tip_v2 = Point(0, 1, size=6, color="green")
tip_v3 = Point(1, 1, size=6, color="blue")
tip_v4 = Point(-1, 1, size=6, color="purple")
tip_v5 = Point(3, 4, size=6, color="orange")

# Create some additional vectors to show different angle relationships
v_horizontal = Vector(2, 0, color="cyan", line_thickness=2)
v_vertical = Vector(0, 2, color="magenta", line_thickness=2)

# Calculate the angle between horizontal and vertical
angle_hor_vert = Angle(v_horizontal, v_vertical)
print(f"\nAngle between horizontal (2,0) and vertical (0,2): {radians_to_degrees(angle_hor_vert):.1f}°")

# Example of calculating angles in a triangle using vectors
# Create three points to form a triangle
A = Point(0, 0, color="red", size=8)
B = Point(3, 0, color="green", size=8)
C = Point(1, 2, color="blue", size=8)

# Create vectors for the sides
AB = Vector(B.x - A.x, B.y - A.y, color="gray", line_thickness=2)
AC = Vector(C.x - A.x, C.y - A.y, color="gray", line_thickness=2)
BA = Vector(A.x - B.x, A.y - B.y, color="lightgray", line_thickness=2)
BC = Vector(C.x - B.x, C.y - B.y, color="lightgray", line_thickness=2)

# Calculate angles at vertices A and B
angle_at_A = Angle(AB, AC)
angle_at_B = Angle(BA, BC)

print(f"\nTriangle angles:")
print(f"Angle at vertex A: {radians_to_degrees(angle_at_A):.1f}°")
print(f"Angle at vertex B: {radians_to_degrees(angle_at_B):.1f}°")

# Create triangle for visualization
triangle = Polygon(A, B, C, color="lightblue", opacity=0.3)

print(f"\nNote: All angles are measured in counterclockwise direction")
print(f"from the first vector to the second vector.") 