import * as MediaLibrary from 'expo-media-library';

export default {
  async getPhotos(options) {
    const results = await MediaLibrary.getAssetsAsync(options);

    const transformedResults = {
      edges: results.assets.map(asset => ({ node: { image: asset } })),
      page_info: { 
        has_next_page: results.hasNextPage,
        end_cursor: results.endCursor,
      }
    }

    return transformedResults;
  }
}