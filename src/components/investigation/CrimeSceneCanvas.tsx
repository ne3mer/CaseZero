import React, { useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NoirColors, Radius, Spacing } from '@/constants/theme';
import { findHotspotAt } from '@/core/logic/hotspot-evaluator';
import { SceneHotspot } from '@/core/types/case';

interface CrimeSceneCanvasProps {
  imageSource: ImageSourcePropType;
  hotspots: SceneHotspot[];
  unlockedEvidenceIds: string[];
  onSelectHotspot: (hotspot: SceneHotspot) => void;
}

export function CrimeSceneCanvas({
  imageSource,
  hotspots,
  unlockedEvidenceIds,
  onSelectHotspot,
}: CrimeSceneCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isLensActive, setIsLensActive] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(360);
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);

  // Aspect ratio of the scene artwork (16:9 widescreen)
  const baseWidth = containerWidth > 0 ? containerWidth : 360;
  const baseHeight = Math.round((baseWidth * 9) / 16);

  const currentWidth = Math.round(baseWidth * zoomLevel);
  const currentHeight = Math.round(baseHeight * zoomLevel);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - containerWidth) > 2) {
      setContainerWidth(width);
    }
  };

  const handleZoomChange = (nextZoom: number) => {
    setZoomLevel(nextZoom);
    if (nextZoom === 1.0) {
      horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
      verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleCanvasTap = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    if (currentWidth <= 0 || currentHeight <= 0) return;

    // Convert pixel tap coordinates to normalized (0.0 to 1.0)
    const normalizedX = locationX / currentWidth;
    const normalizedY = locationY / currentHeight;

    const hit = findHotspotAt(hotspots, normalizedX, normalizedY, 1.25);
    if (hit) {
      onSelectHotspot(hit);
    }
  };

  return (
    <View style={styles.wrapper} onLayout={handleContainerLayout}>
      {/* Canvas Header Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.lensToggleGroup}>
          <Pressable
            onPress={() => setIsLensActive((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={({ pressed }) => [
              styles.lensButton,
              isLensActive ? styles.lensButtonActive : styles.lensButtonInactive,
              pressed && styles.buttonPressed,
            ]}>
            <View
              style={[
                styles.lensDot,
                isLensActive ? styles.lensDotActive : styles.lensDotInactive,
              ]}
            />
            <Text
              style={[
                styles.lensButtonText,
                isLensActive ? styles.lensTextActive : styles.lensTextInactive,
              ]}>
              {isLensActive ? 'DETECTIVE LENS ON' : 'DETECTIVE LENS OFF'}
            </Text>
          </Pressable>
        </View>

        {/* Zoom Presets Controls */}
        <View style={styles.zoomControls}>
          <Text style={styles.zoomLabel}>ZOOM</Text>
          {([1.0, 1.5, 2.0] as const).map((level) => {
            const isActive = zoomLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => handleZoomChange(level)}
                hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                style={({ pressed }) => [
                  styles.zoomButton,
                  isActive && styles.zoomButtonActive,
                  pressed && styles.buttonPressed,
                ]}>
                <Text
                  style={[
                    styles.zoomButtonText,
                    isActive && styles.zoomButtonTextActive,
                  ]}>
                  {level.toFixed(1)}x
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Interactive Crime Scene Viewport */}
      <View style={[styles.viewportContainer, { height: baseHeight }]}>
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          bounces={zoomLevel > 1.0}
          scrollEnabled={zoomLevel > 1.0}
          showsHorizontalScrollIndicator={zoomLevel > 1.0}
          contentContainerStyle={styles.scrollHorizontalContent}>
          <ScrollView
            ref={verticalScrollRef}
            bounces={zoomLevel > 1.0}
            scrollEnabled={zoomLevel > 1.0}
            showsVerticalScrollIndicator={zoomLevel > 1.0}
            contentContainerStyle={styles.scrollVerticalContent}>
            <Pressable
              onPress={handleCanvasTap}
              style={[
                styles.canvasContainer,
                { width: currentWidth, height: currentHeight },
              ]}>
              {/* Scene Illustration Background */}
              <Image
                source={imageSource}
                style={[
                  styles.sceneArtwork,
                  { width: currentWidth, height: currentHeight },
                ]}
                resizeMode="cover"
              />

              {/* Noir Environmental Gradient Tint */}
              <View style={styles.sceneGradientOverlay} pointerEvents="none" />

              {/* Interactive Hotspot Targets */}
              {hotspots.map((hs) => {
                const isCollected = unlockedEvidenceIds.includes(hs.evidenceId);
                const posX = hs.x * currentWidth;
                const posY = hs.y * currentHeight;

                return (
                  <View
                    key={hs.id}
                    style={[
                      styles.hotspotPositioner,
                      {
                        left: posX - 28,
                        top: posY - 28,
                      },
                    ]}>
                    <Pressable
                      onPress={() => onSelectHotspot(hs)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={({ pressed }) => [
                        styles.hotspotHitArea,
                        pressed && styles.hotspotPressed,
                      ]}>
                      {/* Pulse Indicator Ring */}
                      <View
                        style={[
                          styles.hotspotOuterRing,
                          isCollected
                            ? styles.hotspotRingCollected
                            : isLensActive
                            ? styles.hotspotRingActive
                            : styles.hotspotRingSubtle,
                        ]}>
                        <View
                          style={[
                            styles.hotspotInnerCore,
                            isCollected
                              ? styles.hotspotCoreCollected
                              : styles.hotspotCoreUncollected,
                          ]}>
                          <Text style={styles.hotspotIconText}>
                            {isCollected ? '✓' : '?'}
                          </Text>
                        </View>
                      </View>

                      {/* Floating HUD Label when Lens is On */}
                      {isLensActive && (
                        <View style={styles.hotspotLabelBadge}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.hotspotLabelText,
                              isCollected && styles.hotspotLabelCollected,
                            ]}>
                            {isCollected ? 'SECURED' : hs.label.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </Pressable>
          </ScrollView>
        </ScrollView>
      </View>

      {/* Helpful Hint Bar */}
      <View style={styles.hintBar}>
        <Text style={styles.hintText}>
          {zoomLevel > 1.0
            ? 'DRAG TO PAN ACROSS THE WORKSHOP // TAP HIGHLIGHTED OBJECTS TO INSPECT'
            : 'TAP VISIBLE OBJECTS TO INSPECT FORENSIC EVIDENCE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: NoirColors.surfaceElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: NoirColors.borderStrong,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: '#0D1017',
    borderBottomWidth: 1,
    borderBottomColor: NoirColors.borderSubtle,
    gap: Spacing.xs,
  },
  lensToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lensButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    borderWidth: 1,
    gap: 6,
  },
  lensButtonActive: {
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderColor: NoirColors.goldPrimary,
  },
  lensButtonInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: NoirColors.borderSubtle,
  },
  lensDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lensDotActive: {
    backgroundColor: NoirColors.goldLight,
  },
  lensDotInactive: {
    backgroundColor: NoirColors.textMuted,
  },
  lensButtonText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  lensTextActive: {
    color: NoirColors.goldLight,
  },
  lensTextInactive: {
    color: NoirColors.textMuted,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoomLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    marginRight: 2,
    letterSpacing: 0.5,
  },
  zoomButton: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  zoomButtonActive: {
    backgroundColor: NoirColors.goldPrimary,
    borderColor: NoirColors.goldLight,
  },
  zoomButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
  },
  zoomButtonTextActive: {
    color: '#090B0F',
    fontWeight: '900',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  viewportContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#050608',
  },
  scrollHorizontalContent: {
    flexGrow: 1,
  },
  scrollVerticalContent: {
    flexGrow: 1,
  },
  canvasContainer: {
    position: 'relative',
    backgroundColor: '#050608',
  },
  sceneArtwork: {
    backgroundColor: '#050608',
  },
  sceneGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 11, 15, 0.12)',
  },
  hotspotPositioner: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  hotspotHitArea: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotPressed: {
    transform: [{ scale: 0.92 }],
  },
  hotspotOuterRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotRingActive: {
    borderColor: NoirColors.goldLight,
    backgroundColor: 'rgba(197, 160, 89, 0.28)',
  },
  hotspotRingSubtle: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  hotspotRingCollected: {
    borderColor: NoirColors.emerald,
    backgroundColor: 'rgba(61, 184, 126, 0.22)',
  },
  hotspotInnerCore: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotCoreUncollected: {
    backgroundColor: NoirColors.goldPrimary,
  },
  hotspotCoreCollected: {
    backgroundColor: NoirColors.emerald,
  },
  hotspotIconText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#090B0F',
  },
  hotspotLabelBadge: {
    marginTop: 2,
    backgroundColor: 'rgba(9, 11, 15, 0.88)',
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    maxWidth: 120,
  },
  hotspotLabelText: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  hotspotLabelCollected: {
    color: NoirColors.emerald,
    borderColor: NoirColors.emerald,
  },
  hintBar: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    backgroundColor: '#090B0F',
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
