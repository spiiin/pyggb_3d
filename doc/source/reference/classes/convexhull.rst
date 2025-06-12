ConvexHull
==========

.. py:class:: ConvexHull

   In the following constructor, additional keyword arguments can be
   provided to set properties of the new :py:class:`ConvexHull`.

   .. py:method:: ConvexHull(points)

      Construct the convex hull of the given *points*, which should be
      an iterable of at least 3 :py:class:`Point` instances. The convex
      hull is the smallest convex polygon that contains all the given points.

   A :py:class:`ConvexHull` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`opacity`
   * :py:attr:`line_thickness`


.. seealso::

   `GeoGebra ConvexHull() reference
   <https://geogebra.github.io/docs/manual/en/commands/ConvexHull/>`_ 