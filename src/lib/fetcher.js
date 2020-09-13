import axios from 'axios';

const libraryUrl = '/api/sjtu/library';
const canteenUrl = '/api/sjtu/canteen';
const canteenDetailUrl = (id) => `/api/sjtu/canteen/${id}`;

const formatCanteenData = (list) => list.map((e) => ({ name: e.Name, rest: e.Seat_s - e.Seat_u, max: e.Seat_s, id: e.Id }));

const axiosGet = (url, onSuccess, onFail) =>
  axios
    .get(url)
    .then((res) => {
      if (res.status === 200) {
        onSuccess && onSuccess(res.data);
      } else {
        onFail && onFail();
      }
    })
    .catch(() => onFail && onFail());

export const getLibraryData = async (onSuccess, onFail) =>
  axiosGet(
    libraryUrl,
    (data) => {
      const formatted = data.numbers.map((e) => ({ name: e.areaName, rest: e.max - e.inCounter, max: e.max }));
      onSuccess && onSuccess(formatted);
    },
    onFail
  );

export const getCanteenData = async (onSuccess, onFail) => {
  axiosGet(
    canteenUrl,
    (data) => {
      const formatted = formatCanteenData(data);
      onSuccess && onSuccess(formatted);
    },
    onFail
  );
};

export const getDetailedCanteenData = async (id, onSuccess, onFail) => {
  axiosGet(
    canteenDetailUrl(id),
    (data) => {
      const formatted = formatCanteenData(data);
      onSuccess && onSuccess(formatted);
    },
    onFail
  );
};
