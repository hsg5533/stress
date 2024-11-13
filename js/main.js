const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const numCoresInput = document.getElementById("numCores");
const progressBar = document.getElementById("progressBar");
const cpuUsageText = document.getElementById("cpuUsageText");
const core = navigator.hardwareConcurrency;
const workers = [];
numCoresInput.max = core;
numCoresInput.value = core;

// CPU 사용률 업데이트 함수
function updateCpuUsage() {
  // 현재 작업자의 수에 따라 CPU 사용률을 계산
  const cpuUsage =
    workers.length > 0 ? ((workers.length / core) * 100).toFixed(2) : 0;
  cpuUsageText.textContent = `CPU 사용률: ${cpuUsage}%`;
  progressBar.style.width = `${cpuUsage}%`;
}

// 새 작업자 생성 함수
function createWorker() {
  const worker = new Worker("./js/fibonacci.js");
  worker.onmessage = (event) => {
    if (event.data === "active") {
      updateCpuUsage(); // 작업자가 활동 중일 때 CPU 사용률 업데이트
    }
  };
  return worker;
}

// Start 버튼 클릭 이벤트
startButton.addEventListener("click", () => {
  if (numCoresInput.value < 1) {
    alert("최소 코어 수는 1입니다.");
  } else if (numCoresInput.value > core) {
    alert("사용 가능한 최대 코어 수를 초과했습니다.");
  } else {
    startButton.disabled = true;
    stopButton.disabled = false;
    const numCores = parseInt(numCoresInput.value);
    for (let i = 0; i < numCores; i++) {
      const worker = createWorker();
      workers.push(worker);
    }
    updateCpuUsage();
  }
});

// Stop 버튼 클릭 이벤트
stopButton.addEventListener("click", () => {
  workers.forEach((worker) => worker.terminate()); // 모든 작업자 종료
  workers.length = 0; // 작업자 배열 초기화
  updateCpuUsage(); // CPU 사용률 0%로 초기화
  startButton.disabled = false;
  stopButton.disabled = true;
});

// 페이지가 로드될 때 CPU 사용률 0%로 초기화
updateCpuUsage();
