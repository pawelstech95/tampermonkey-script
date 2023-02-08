import { getCookie } from './utils';

export interface Developer {
  uuid: string;
  note: string;
}

export class PrimetricApiService {
  private static instance: PrimetricApiService;

  private developers: any[];
  private count: number;
  private page: number;
  private pageSize: number;

  static getInstance(): PrimetricApiService {
    if (!this.instance) {
      this.instance = new PrimetricApiService();
    }

    return this.instance;
  }

  async getDevelopers(host: string, force?: boolean) {
    this.page = 1;
    this.pageSize = 75;

    if (!this.developers || !host || force) {
      const response = await fetch(
        `https://${host}/api/myHub/developers/?page=1&page_size=${this.pageSize}&workload_min=1990-01-01&workload_max=2050-01-31`
      );

      this.count = (await response.json()).count;
      const totalPages = Math.ceil(this.count / this.pageSize);

      const promises = Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        return fetch(
          `https://${host}/api/myHub/developers/?page=${page}&page_size=${this.pageSize}&workload_min=1990-01-01&workload_max=2050-01-31`
        ).then((res) => res.json());
      });

      const results = await Promise.all(promises);

      this.developers = results.flatMap(
        (result: { results: any }) => result.results
      );
    }

    return this.developers as Developer[];
  }

  async updateDeveloperNotes(host: string, uuid: string, note: string) {
    await fetch(`https://${host}/api/employees_profiles/${uuid}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-csrftoken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ note }),
    });

    await this.getDevelopers(host, true);
  }
}
