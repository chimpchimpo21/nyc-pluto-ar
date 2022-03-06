--procedural to create centroids of building outlines around Hunter College
--then create same centroids in spherical mercator projection (for use in web dev AR)
ALTER TABLE hunter
ADD centroids geometry(POINT, 4326);
UPDATE hunter
SET centroids = ST_Centroid(wkb_geometry);
ALTER TABLE hunter
ADD geom_sm geometry(POINT, 3857);
UPDATE hunter
set geom_sm = ST_Transform(centroids, 3857);

--test
SELECT ST_Transform(geom_sm, 4326)
FROM hunter;

--spatial index
CREATE INDEX hunter_geom_sm_idx
ON hunter USING GIST(geom_sm);

--SRID
SELECT Find_SRID('public', 'hunter', 'geom_sm');