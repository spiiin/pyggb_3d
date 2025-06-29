"""
Rotate command examples

This example demonstrates all four variants of the Rotate command:
1. Rotate(object, angle) - rotation around origin
2. Rotate(object, angle, point) - rotation around a point
3. Rotate(object, angle, axis) - rotation around an axis
4. Rotate(object, angle, point_on_axis, axis_direction) - rotation around custom axis
"""

import math

# Create some basic objects to rotate
original_point = Point(2, 1, 0, color="red", size=8)
original_segment = Segment(Point(1, 0, 0), Point(3, 2, 0), color="blue", line_thickness=3)

# Example 1: Rotate around origin
# Rotate(object, angle)
rotated_point_origin = Rotate(original_point, math.pi/4)
rotated_point_origin.color = "orange"
rotated_point_origin.size = 8

rotated_segment_origin = Rotate(original_segment, math.pi/6)
rotated_segment_origin.color = "green"
rotated_segment_origin.line_thickness = 3

# Example 2: Rotate around a specific point
# Rotate(object, angle, point)
rotation_center = Point(1, 1, 0, color="purple", size=10)
rotated_point_around_center = Rotate(original_point, -math.pi/3, rotation_center)
rotated_point_around_center.color = "cyan"
rotated_point_around_center.size = 8

rotated_segment_around_center = Rotate(original_segment, math.pi/4, rotation_center)
rotated_segment_around_center.color = "magenta"
rotated_segment_around_center.line_thickness = 3

# Example 3: Rotate around axes
# Rotate(object, angle, axis)

# Create 3D objects for axis rotation examples
point_3d = Point(2, 1, 1, color="red", size=10)

# Rotate around X-axis
rotated_around_x = Rotate(point_3d, math.pi/2, xAxis)
rotated_around_x.color = "orange"
rotated_around_x.size = 10

# Rotate around Y-axis  
rotated_around_y = Rotate(point_3d, math.pi/2, yAxis)
rotated_around_y.color = "yellow"
rotated_around_y.size = 10

# Rotate around Z-axis
rotated_around_z = Rotate(point_3d, math.pi/2, zAxis)
rotated_around_z.color = "lime"
rotated_around_z.size = 10

# Example 4: Rotate around custom axis
# Rotate(object, angle, point_on_axis, axis_direction)

# Create a custom axis - diagonal through origin
axis_point = Point(0, 0, 0, color="black", size=8)
axis_direction = Vector(1, 1, 1)  # Diagonal direction in 3D space

# Create a point to rotate around this custom axis
test_point = Point(3, 0, 0, color="darkred", size=10)

# Rotate around the custom axis
rotated_custom_axis = Rotate(test_point, math.pi/2, axis_point, axis_direction)
rotated_custom_axis.color = "pink"
rotated_custom_axis.size = 10

# Another example with different axis direction
axis_point_2 = Point(1, 1, 1, color="brown", size=8)
axis_direction_2 = Vector(0, 1, 0)  # Vertical direction (Y-axis direction)

test_point_2 = Point(2, 0, 2, color="navy", size=10)
rotated_custom_axis_2 = Rotate(test_point_2, math.pi/3, axis_point_2, axis_direction_2)
rotated_custom_axis_2.color = "lightblue"
rotated_custom_axis_2.size = 10

# Create segments to show the axes
axis_x = Segment(Point(-3, 0, 0), Point(3, 0, 0), color="red", line_thickness=2)
axis_y = Segment(Point(0, -3, 0), Point(0, 3, 0), color="green", line_thickness=2)  
axis_z = Segment(Point(0, 0, -3), Point(0, 0, 3), color="blue", line_thickness=2)

# Show custom axis as a line
custom_axis_line = Segment(
    Point(-2, -2, -2), 
    Point(2, 2, 2), 
    color="gray", 
    line_thickness=3,
    line_style="dashed"
)

# Add labels to understand what we're seeing
print("Rotate Examples:")
print("Red point: Original")
print("Orange points: Rotated around origin and X-axis")
print("Cyan/Yellow points: Rotated around center point and Y-axis")  
print("Lime point: Rotated around Z-axis")
print("Pink point: Rotated around custom diagonal axis")
print("Light blue point: Rotated around custom vertical axis")
print("Purple/Brown points: Rotation centers")
print("Gray dashed line: Custom diagonal axis") 