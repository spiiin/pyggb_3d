Rotate function
===============

.. py:function:: Rotate(obj, theta)

   Construct a new (non-independent) GeoGebra object which is the
   result of rotating the given *obj* about the origin through the
   given angle *theta*, which is measured in radians with
   anticlockwise being positive.

.. py:function:: Rotate(obj, theta, p)
   :noindex:

   Construct a new (non-independent) GeoGebra object which is the
   result of rotating the given *obj* about the given point *p*
   through the given angle *theta*, which is measured in radians with
   anticlockwise being positive.

.. py:function:: Rotate(obj, theta, axis)
   :noindex:

   Construct a new (non-independent) GeoGebra object which is the
   result of rotating the given *obj* about the given *axis* through the
   given angle *theta*, which is measured in radians with
   anticlockwise being positive.

   The *axis* parameter should be one of the predefined constants:
   ``xAxis``, ``yAxis``, or ``zAxis``.

   Example::

      p = Point(1, 0, 0)
      rotated_p = Rotate(p, pi/4, zAxis)  # Rotate point around z-axis

.. py:function:: Rotate(obj, theta, point_on_axis, axis_direction)
   :noindex:

   Construct a new (non-independent) GeoGebra object which is the
   result of rotating the given *obj* about a custom axis defined by
   a *point_on_axis* and *axis_direction* through the given angle *theta*,
   which is measured in radians with anticlockwise being positive.

   :param obj: The object to rotate
   :param theta: The rotation angle in radians  
   :param point_on_axis: A point that lies on the rotation axis
   :param axis_direction: A vector defining the direction of the rotation axis, or a plane

   Example::

      p = Point(2, 1, 1)
      axis_point = Point(0, 0, 0)
      axis_vector = Vector(1, 1, 0)  # Diagonal direction in XY plane
      rotated_p = Rotate(p, pi/3, axis_point, axis_vector)


.. seealso::

   `GeoGebra Rotate() reference
   <https://geogebra.github.io/docs/manual/en/commands/Rotate/>`_
