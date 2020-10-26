import * as MediaLibrary from 'expo-media-library'

const ASSET_TYPE_TO_MEDIA_TYPE = {
  Photos: MediaLibrary.MediaType.photo,
  Videos: MediaLibrary.MediaType.video,
}

/**
 * `CameraRoll` provides access to the local camera roll or photo library.
 *
 * See https://facebook.github.io/react-native/docs/cameraroll.html
 */
export default {
  /**
   * Holds a mapping from local file uri to MediaLibrary Asset
   */
  _store: {},

  /**
   * Returns a Promise with photo identifier objects from the local camera
   * roll of the device matching shape defined by `getPhotosReturnChecker`.
   *
   * See https://reactnative.dev/docs/cameraroll.html#getphotos
   */
  async getPhotos(params) {
    const mediaLibraryParams = {
      first: params.first,
      after: params.after,
      mediaType: ASSET_TYPE_TO_MEDIA_TYPE[params.assetType] || params.assetType,
    }

    const results = await MediaLibrary.getAssetsAsync(mediaLibraryParams)

    results.assets.forEach((asset) => {
      this._store[asset.uri] = asset
    })

    const transformedResults = {
      edges: results.assets.map((asset) => ({
        node: {
          type: asset.mediaType,
          image: {
            filename: asset.filename,
            uri: asset.uri,
            height: asset.height,
            width: asset.width,
            playableDuration: asset.duration,
          },
          timestamp: asset.modificationTime,
          location: null,
        },
      })),
      page_info: {
        has_next_page: results.hasNextPage,
        start_cursor: null,
        end_cursor: results.endCursor,
      },
    }

    return transformedResults
  },

  /**
   * On iOS: requests deletion of a set of photos from the camera roll.
   * On Android: Deletes a set of photos from the camera roll.
   */
  async deletePhotos(photoUris) {
    const assets = photoUris.map((uri) => this._store[uri]).filter((x) => !!x)

    const ok = await MediaLibrary.deleteAssetsAsync(assets)

    if (ok) {
      photoUris.forEach((uri) => {
        delete this._store[uri]
      })
    }
  },

  /**
   * Saves the photo or video to the camera roll or photo library.
   */
  async save(tag, options = {}) {
    const asset = await MediaLibrary.createAssetAsync(tag)

    if (options.album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], options.album, false)
    }

    return asset.uri
  },

  /**
   * Saves the photo or video to the camera roll or photo library.
   */
  async saveToCameraRoll(tag, type) {
    return this.save(tag, { type })
  },
}
