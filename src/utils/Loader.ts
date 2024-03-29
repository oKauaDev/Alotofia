export default function Loader() {
  const loader = document.querySelector(".loading_modal");
  const loadertext = document.querySelector("[data-loadingtext]");

  function hidden() {
    loader?.classList.add("hidden");
  }

  function visible() {
    loader?.classList.remove("hidden");
  }

  function text(text: string) {
    if (loadertext) {
      loadertext.innerHTML = text;
    }
  }

  return {
    hidden,
    visible,
    text,
  };
}
