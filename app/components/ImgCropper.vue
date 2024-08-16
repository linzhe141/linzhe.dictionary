<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

const props = defineProps<{
  url: string
  width: number
  height: number
}>()

const image = ref<HTMLImageElement | null>(null)
let cropper: Cropper | null = null

function getCroppedImg() {
  const croppedCanvas = cropper!.getCroppedCanvas()
  const base64Data = croppedCanvas.toDataURL('image/jpeg')
  return base64Data
}

defineExpose({ getCroppedImg })

onMounted(() => {
  cropper = new Cropper(image.value!, {
    viewMode: 0, // 保证图片适应裁剪框并保持边界
    scalable: true, // 启用缩放
    responsive: true, // 响应式调整
    autoCropArea: 1,
    cropBoxResizable: false,
    aspectRatio: props.width / props.height, // 宽度600 / 高度200 = 3
    movable: false, // 禁止移动裁剪框
    ready: function () {
      cropper!.setCropBoxData({
        left: 0,
        top: 20,
        width: props.width,
        height: props.height,
      })
    },
  })

  image.value!.addEventListener('cropstart', (event: any) => {
    // 检查是否有一个现有的编辑框
    if (
      cropper!.getCropBoxData().width > 0 &&
      cropper!.getCropBoxData().height > 0
    ) {
      // 如果编辑框已经存在，阻止创建新的编辑框
      if (event.detail.action === 'crop') {
        event.preventDefault()
      }
    }
  })
})
</script>

<template>
  <div class="h-[200px]">
    <img ref="image" :src="url" alt="edit img" class="w-full" />
  </div>
</template>
