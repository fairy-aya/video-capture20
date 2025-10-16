/**
 * アプリケーション状態管理（Zustand）
 */

import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // 動画関連
  videoFile: null,
  videoUrl: null,
  videoDuration: 0,
  videoWidth: 0,
  videoHeight: 0,
  videoError: null,

  // 分割設定
  splitCount: 20,
  customTimesInput: '',
  customTimes: [],

  // 出力設定
  outputFormat: 'png',
  outputQuality: 0.92,
  filePrefix: 'capture',

  // キャプチャ状態
  isCapturing: false,
  progress: 0,
  totalFrames: 0,
  capturedFrames: [],
  abortController: null,

  // タイムライン
  currentTime: 0,
  isPlaying: false,

  // アクション
  setVideoFile: (file) => {
    const url = URL.createObjectURL(file);
    set({
      videoFile: file,
      videoUrl: url,
      videoError: null,
      capturedFrames: []
    });
  },

  setVideoMetadata: (duration, width, height) => {
    set({
      videoDuration: duration,
      videoWidth: width,
      videoHeight: height
    });
  },

  setVideoError: (error) => {
    set({ videoError: error });
  },

  setSplitCount: (count) => {
    set({ splitCount: Math.max(5, Math.min(200, count)) });
  },

  setCustomTimesInput: (input) => {
    set({ customTimesInput: input });
  },

  setCustomTimes: (times) => {
    set({ customTimes: times });
  },

  setOutputFormat: (format) => {
    set({ outputFormat: format });
  },

  setOutputQuality: (quality) => {
    set({ outputQuality: quality });
  },

  setFilePrefix: (prefix) => {
    set({ filePrefix: prefix });
  },

  startCapture: (controller, totalFrames) => {
    set({
      isCapturing: true,
      progress: 0,
      totalFrames,
      capturedFrames: [],
      abortController: controller
    });
  },

  updateProgress: (completed, total) => {
    set({
      progress: (completed / total) * 100
    });
  },

  addCapturedFrame: (frame) => {
    set((state) => ({
      capturedFrames: [...state.capturedFrames, frame]
    }));
  },

  setCapturedFrames: (frames) => {
    set({ capturedFrames: frames });
  },

  finishCapture: () => {
    set({
      isCapturing: false,
      progress: 100,
      abortController: null
    });
  },

  cancelCapture: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({
      isCapturing: false,
      progress: 0,
      abortController: null
    });
  },

  setCurrentTime: (time) => {
    set({ currentTime: time });
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing });
  },

  reset: () => {
    const { videoUrl } = get();
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    set({
      videoFile: null,
      videoUrl: null,
      videoDuration: 0,
      videoWidth: 0,
      videoHeight: 0,
      videoError: null,
      splitCount: 20,
      customTimesInput: '',
      customTimes: [],
      outputFormat: 'png',
      outputQuality: 0.92,
      filePrefix: 'capture',
      isCapturing: false,
      progress: 0,
      totalFrames: 0,
      capturedFrames: [],
      abortController: null,
      currentTime: 0,
      isPlaying: false
    });
  }
}));

