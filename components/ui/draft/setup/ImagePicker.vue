<script setup lang="ts">
    const cross_icon = ref<HTMLElement | null>(null);
    const plus_icon = ref<HTMLElement | null>(null);
    const picker_label = ref<HTMLElement | null>(null);
    const file_input = ref<HTMLInputElement | null>(null);
    const image_bg = ref<HTMLImageElement | null>(null);

    const image_set = ref<string | null>('');

    const clearInput = () => {
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        input.value = '';

        image_set.value = null;
    }

    onMounted(() => {
        const input = file_input.value as HTMLInputElement;
        const label = picker_label.value as HTMLLabelElement;
        const cross = cross_icon.value as HTMLElement;
        const plus = plus_icon.value as HTMLElement;
        const image_preview = image_bg.value as HTMLImageElement;

        input.addEventListener('change', () => {
            if (input.files?.length! > 0) {
                plus.classList.add('hidden');
                cross.classList.remove('hidden');
                image_preview.classList.remove('hidden');

                readURL();
            } else {
                plus.classList.remove('hidden');
                cross.classList.add('hidden');
                image_preview.classList.add('hidden');
            }
        });

        cross.addEventListener('click', () => {
            clearInput();
            plus.classList.remove('hidden');
            cross.classList.add('hidden');
            image_preview.classList.add('hidden');
        });

        label.addEventListener('click', () => {
            input.click();
        });
    });

    const readURL = () => {
        if ((file_input.value as HTMLInputElement).files != null) {
            const reader = new FileReader();

            reader.onload = function (e) {
                image_set.value = e.target?.result as string;
            };

            const inputFile = file_input.value as HTMLInputElement;
            if (inputFile && inputFile.files && inputFile.files[0]) {
                reader.readAsDataURL(inputFile.files[0]);
            }
        }
    }

    watch(() => image_set.value, (value) => {
        if (value) {
            console.log('Image set:', value);
            image_bg.value?.setAttribute('src', value);
        }
    });
</script>

<template>
    <div class="flex relative bg-[rgba(0,0,0,0.1)] rounded-[5px]">
        <svg ref="cross_icon" class="hidden absolute top-[8px] right-[8px] drop-shadow-lg h-[24px] w-[24px] cursor-pointer" id="dog-image-input-principal-label-cross" fill="rgba(255, 0, 0, 0.75)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.036-4.024a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z"></path></svg>
        <input ref="file_input" class="hidden" value="" type="file" name="file" accept="image/png, image/jpeg">
        <label ref="picker_label" for="file" class="flex w-full h-full flex-col items-center justify-center cursor-pointer text-primary font-[1.5rem] rounded-[8px] bg-center bg-cover">
            <img ref="image_bg" :src="image_set" alt="Foto principal del perro" class="hidden w-full h-full object-cover rounded-[8px] bg-cover" />
            <svg ref="plus_icon" fill="rgba(0, 0, 0, 0.5)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path fill-rule="evenodd" d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z"></path></svg>
        </label>
    </div>
</template>