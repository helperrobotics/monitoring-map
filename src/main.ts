// 유틸 함수

function getMapUrl(mapId: string) {
  return `https://hprobot-bucket.s3.ap-northeast-2.amazonaws.com/map_images/map-background-${mapId}-monitoring.png`;
}

function appendErrorMessage(
  container: HTMLElement,
  message: { title: string; description?: string },
) {
  const wrapper = document.createElement('div');

  const title = message.title;
  const description = message.description ?? '관리자에게 문의해주세요';

  const span1 = document.createElement('span');
  span1.textContent = `${title}`;

  const span2 = document.createElement('span');
  span2.textContent = description;

  wrapper.appendChild(span1);
  wrapper.appendChild(span2);

  container.appendChild(wrapper);
}

const VALID_MAP_IDS = ['2', '5', '6', '19', '909'];

// DOM 요소
const mapContainer = document.getElementById('map-images');
const errorMessage = document.getElementById('error-message');

// 쿼리 파라미터에서 mapId 추출
const urlParams = new URLSearchParams(window.location.search);
const rawMapIdParam = urlParams.get('mapId');

// 1. mapId가 없는 경우
if (!rawMapIdParam) {
  if (errorMessage) {
    appendErrorMessage(errorMessage, {
      title: '맵 ID가 제공되지 않았습니다.',
    });
  }
  throw new Error('Missing mapId parameter in URL.');
}

// 2. mapId 파싱 및 유효성 검사
const rawMapIds = rawMapIdParam
  .split(',')
  .map(id => id.replace(/[^0-9]/g, '').trim()) // 숫자만 남김
  .filter(id => id !== '' && /^\d+$/.test(id)); // 빈 문자열과 숫자가 아닌 것 필터링

const validMapIds = rawMapIds.filter(id => VALID_MAP_IDS.includes(id));
const invalidMapIds = rawMapIds.filter(id => !VALID_MAP_IDS.includes(id));

// 3. 유효하지 않은 mapId 존재 시 에러 출력
if (invalidMapIds.length > 0 && errorMessage) {
  appendErrorMessage(errorMessage, {
    title: `유효하지 않은 맵 ID: ${invalidMapIds.join(', ')}`,
  });
}

// 4. 유효한 mapId가 하나도 없는 경우
if (validMapIds.length === 0) {
  throw new Error('No valid mapId provided.');
}

// 5. 유효한 mapId만 이미지로 로딩
if (mapContainer) {
  validMapIds.forEach(mapId => {
    const mapUrl = getMapUrl(mapId);
    const mapImage = new Image();

    mapImage.src = mapUrl;
    mapImage.alt = `Map Image for ID ${mapId}`;

    mapImage.onerror = () => {
      console.warn(`이미지 로드 실패: ${mapUrl}`);
      if (errorMessage) {
        appendErrorMessage(errorMessage, {
          title: `맵 ID ${mapId}의 이미지를 불러올 수 없습니다.`,
        });
      }
    };

    mapImage.onload = () => {
      mapContainer.appendChild(mapImage);
    };
  });
}
