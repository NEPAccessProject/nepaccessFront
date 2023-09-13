// PDFViewerDialog.test.js

import axios from 'axios';
import { getFilesById, getProcessByProcessId } from './PDFViewerDialog';

//require('jest')
describe('PDFViewerDialog', () => {

  describe('getFilesById', () => {

    it('makes expected API call', async () => {
      // Mock API call
      axios.get.mockResolvedValueOnce({
        data: []   
      });

      await getFilesById(123);

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:3000/file/nepafiles?id=123'
      );
    });

    it('returns expected files', async () => {
      // Mock API response
      const mockFiles = [{ id: 1}, {id: 2}];
      axios.get.mockResolvedValueOnce({ data: mockFiles });

      const files = await getFilesById(123);

      expect(files).toEqual(mockFiles);
    });

  });

  describe('getProcessByProcessId', () => {

    it('makes expected API call', async () => {
      // Mock API call  
      axios.get.mockResolvedValueOnce({
        data: []
      });

      await getProcessByProcessId(456);

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:3000/test/get_process_full?processId=456'  
      );
    });

    it('returns expected files', async () => {
      // Mock API response
      const mockFiles = [{ id: 3}, {id: 4}];
      axios.get.mockResolvedValueOnce({ data: mockFiles });

      const files = await getProcessByProcessId(456);

      expect(files).toEqual(mockFiles);
    });

  });

});