import { Annotation } from '../types/annotation';

export function exportAnnotationsToJson(annotations: Annotation[], slideName: string) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    slideName,
    annotationCount: annotations.length,
    annotations,
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slideName.replace(/\.[^/.]+$/, '')}_annotations_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAnnotationsToGeoJson(annotations: Annotation[], slideName: string) {
  const features = annotations.map((ann) => {
    let geometry: any = null;

    if (ann.type === 'point' && ann.points.length > 0) {
      geometry = {
        type: 'Point',
        coordinates: [ann.points[0].x, ann.points[0].y],
      };
    } else if (ann.type === 'rectangle' && ann.points.length >= 2) {
      const p1 = ann.points[0];
      const p2 = ann.points[1];
      geometry = {
        type: 'Polygon',
        coordinates: [
          [
            [p1.x, p1.y],
            [p2.x, p1.y],
            [p2.x, p2.y],
            [p1.x, p2.y],
            [p1.x, p1.y],
          ],
        ],
      };
    } else if ((ann.type === 'polygon' || ann.type === 'freehand') && ann.points.length >= 3) {
      const coords = ann.points.map((p) => [p.x, p.y]);
      // Ensure closed polygon
      if (
        coords[0][0] !== coords[coords.length - 1][0] ||
        coords[0][1] !== coords[coords.length - 1][1]
      ) {
        coords.push(coords[0]);
      }
      geometry = {
        type: 'Polygon',
        coordinates: [coords],
      };
    } else if (ann.type === 'ruler' && ann.points.length >= 2) {
      geometry = {
        type: 'LineString',
        coordinates: ann.points.map((p) => [p.x, p.y]),
      };
    }

    return {
      type: 'Feature',
      id: ann.id,
      geometry,
      properties: {
        label: ann.label,
        category: ann.category,
        color: ann.color,
        notes: ann.notes || '',
        lengthMicrons: ann.lengthMicrons,
        areaMicronsSquare: ann.areaMicronsSquare,
        createdAt: ann.createdAt,
      },
    };
  });

  const geoJson = {
    type: 'FeatureCollection',
    metadata: {
      slideName,
      exportedAt: new Date().toISOString(),
    },
    features,
  };

  const jsonStr = JSON.stringify(geoJson, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slideName.replace(/\.[^/.]+$/, '')}_qupath_geojson_${Date.now()}.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedAnnotations(jsonContent: string, currentSlideId: string): Annotation[] {
  try {
    const parsed = JSON.parse(jsonContent);

    // If standard export structure
    if (parsed.annotations && Array.isArray(parsed.annotations)) {
      return parsed.annotations.map((ann: any) => ({
        ...ann,
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        slideId: currentSlideId,
      }));
    }

    // If direct array
    if (Array.isArray(parsed)) {
      return parsed.map((ann: any) => ({
        ...ann,
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        slideId: currentSlideId,
      }));
    }

    // If GeoJSON
    if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
      return parsed.features.map((feat: any, idx: number) => {
        const props = feat.properties || {};
        const geom = feat.geometry || {};
        let type: any = 'point';
        let points: any[] = [];

        if (geom.type === 'Point') {
          type = 'point';
          points = [{ x: geom.coordinates[0], y: geom.coordinates[1] }];
        } else if (geom.type === 'Polygon') {
          type = 'polygon';
          points = (geom.coordinates[0] || []).map((coord: number[]) => ({
            x: coord[0],
            y: coord[1],
          }));
        } else if (geom.type === 'LineString') {
          type = 'ruler';
          points = (geom.coordinates || []).map((coord: number[]) => ({
            x: coord[0],
            y: coord[1],
          }));
        }

        return {
          id: `imported-geo-${idx}-${Date.now()}`,
          slideId: currentSlideId,
          type,
          label: props.label || `Feature ${idx + 1}`,
          category: props.category || 'general',
          color: props.color || '#ef4444',
          notes: props.notes || '',
          points,
          isVisible: true,
          lengthMicrons: props.lengthMicrons,
          areaMicronsSquare: props.areaMicronsSquare,
          createdAt: props.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
    }

    throw new Error('Unrecognized annotation format');
  } catch (err: any) {
    throw new Error(`Failed to parse file: ${err.message}`);
  }
}
